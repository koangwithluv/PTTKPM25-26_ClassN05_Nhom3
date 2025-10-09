import { randomUUID } from 'crypto'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

interface AssignmentRow extends RowDataPacket {
  lecturerId: number
  teacherName: string
  degreeId: number | null
  classId: number
  className: string
  courseId: number
  students: number
  subjectName: string
  periods: number
  courseCoeff: number
  academicYear: string
  semesterName: string
}

interface DegreeCoeffRow extends RowDataPacket {
  id: number
  degreeId: number
  coeff: number
}

interface ClassCoeffRow extends RowDataPacket {
  id: number
  minStudents: number
  maxStudents: number
  coeff: number
}

interface RateRow extends RowDataPacket {
  id: number
  value: number
  appliedFrom: string | null
}

interface TeachingHistoryRow extends RowDataPacket {
  id: number
  teacherId: number
  className: string
  subjectName: string
  academicYear: string
  semesterName: string
  numLessons: number
  rateId: number | null
  degreeCoeffId: number | null
  classCoeffId: number | null
  total: number
  calculatedAt: Date
  batchId: string
}

export async function POST(req: NextRequest) {
  try {
    let body = null
    try {
      body = await req.json()
    } catch {
      // Nếu không có body, sẽ tính tổng hợp
    }

    const { searchParams } = req.nextUrl
    const forceRecalculate = searchParams.get('force') === 'true'
    const filterAcademicYear = searchParams.get('academicYear') || undefined
    const filterSemesterName = searchParams.get('semesterName') || undefined

    // Nếu có body (tính lương cho 1 trường hợp), giữ nguyên logic cũ
    if (body && Object.keys(body).length > 0) {
  const { numLessons, rate, degreeCoeff, classCoeff, courseCoeff } = body
      // Số tiết quy đổi = số tiết thực tế * (hệ số học phần + hệ số lớp)
      const soTietQuyDoi = Number(numLessons) * (Number(courseCoeff) + Number(classCoeff))
      // Tổng tiền = số tiết quy đổi * hệ số giáo viên * tiền dạy một tiết
      const total = soTietQuyDoi * Number(degreeCoeff) * Number(rate)
      return NextResponse.json({ total })
    }

    const batchId = randomUUID()

    // Nếu không có body, thực hiện tính lương tổng hợp cho toàn bộ giáo viên
    // 1. Lấy danh sách phân công, lớp học, giáo viên, hệ số lớp, hệ số giáo viên, định mức, năm học, kỳ học, hệ số học phần
    const [assignmentsRaw] = await db.query<AssignmentRow[]>(`
      SELECT a.*, t.fullName as teacherName, t.degreeId, c.id as classId, c.name as className, c.courseId, c.students,
             co.name as subjectName, co.periods, co.coefficient as courseCoeff, s.academicYear, s.name as semesterName
      FROM Assignment a
      JOIN Teacher t ON a.lecturerId = t.id
      JOIN Class c ON a.classId = c.id
      JOIN Course co ON c.courseId = co.id
      JOIN Semester s ON c.semesterId = s.id
    `)
    const assignments = assignmentsRaw

    const [degreeCoeffs] = await db.query<DegreeCoeffRow[]>('SELECT * FROM DegreeCoeff')
    const [classCoeffs] = await db.query<ClassCoeffRow[]>('SELECT * FROM ClassCoeff')
    const [rates] = await db.query<RateRow[]>('SELECT * FROM Rate ORDER BY appliedFrom DESC')

    const results: Array<{ teacherId: number; teacherName: string; className: string; subjectName: string; academicYear: string; semesterName: string; numLessons: number; rateId: number | null; degreeCoeffId: number | null; classCoeffId: number | null; total: number; batchId: string }> = []
    const skipped: Array<{ teacherId: number; teacherName: string; className: string; academicYear: string; semesterName: string; reason: string }> = []

    for (const a of assignments) {
      if ((filterAcademicYear && a.academicYear !== filterAcademicYear) || (filterSemesterName && a.semesterName !== filterSemesterName)) {
        continue
      }
      // Hệ số giáo viên
      const degreeCoeffObj = degreeCoeffs.find(dc => dc.degreeId === a.degreeId)
      const degreeCoeff = degreeCoeffObj ? degreeCoeffObj.coeff : 1
      const degreeCoeffId = degreeCoeffObj ? degreeCoeffObj.id : null
      // Hệ số lớp
      const classCoeffObj = classCoeffs.find(cc => a.students >= cc.minStudents && a.students <= cc.maxStudents)
      const classCoeff = classCoeffObj ? classCoeffObj.coeff : 1
      const classCoeffId = classCoeffObj ? classCoeffObj.id : null
      // Định mức tiền/tiết (lấy theo ngày hiện tại hoặc gần nhất)
      let rate = rates[0]?.value || 0
      let rateId = rates[0]?.id || null
      for (const r of rates) {
        if (r.appliedFrom && new Date(r.appliedFrom) <= new Date()) {
          rate = r.value
          rateId = r.id
          break
        }
      }
      // Số tiết thực tế và hệ số học phần
      const numLessons = a.periods || 0
      const courseCoeff = Number(a.courseCoeff) || 0
      // Số tiết quy đổi = số tiết thực tế * (hệ số học phần + hệ số lớp)
      const soTietQuyDoi = numLessons * (courseCoeff + Number(classCoeff))
      // Tổng tiền = số tiết quy đổi * hệ số giáo viên * tiền dạy một tiết
      const total = soTietQuyDoi * Number(degreeCoeff) * Number(rate)
      const [existingRows] = await db.query<TeachingHistoryRow[]>(
        `SELECT * FROM TeachingHistory
         WHERE teacherId = ? AND className = ? AND subjectName = ? AND academicYear = ? AND semesterName = ?
         ORDER BY calculatedAt DESC
         LIMIT 1`,
        [a.lecturerId, a.className, a.subjectName, a.academicYear, a.semesterName]
      )

      const existing = existingRows[0]
      const hasChanged =
        !existing ||
        existing.numLessons !== numLessons ||
        existing.rateId !== rateId ||
        existing.degreeCoeffId !== degreeCoeffId ||
        existing.classCoeffId !== classCoeffId ||
        Number(existing.total) !== Number(total)

      if (!hasChanged && !forceRecalculate) {
        skipped.push({
          teacherId: a.lecturerId,
          teacherName: a.teacherName,
          className: a.className,
          academicYear: a.academicYear,
          semesterName: a.semesterName,
          reason: 'Không có thay đổi so với lần tính gần nhất',
        })
        continue
      }

      await db.query<ResultSetHeader>(
        'INSERT INTO TeachingHistory (teacherId, teacherName, className, subjectName, academicYear, semesterName, numLessons, rateId, degreeCoeffId, classCoeffId, total, batchId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [a.lecturerId, a.teacherName, a.className, a.subjectName, a.academicYear, a.semesterName, numLessons, rateId, degreeCoeffId, classCoeffId, total, batchId]
      )

      results.push({
        teacherId: a.lecturerId,
        teacherName: a.teacherName,
        className: a.className,
        subjectName: a.subjectName,
        academicYear: a.academicYear,
        semesterName: a.semesterName,
        numLessons,
        rateId,
        degreeCoeffId,
        classCoeffId,
        total,
        batchId,
      })
    }
    return NextResponse.json({ success: true, batchId, inserted: results, skipped })
  } catch (error) {
    console.error('Lỗi khi tính lương tổng hợp:', error)
    return NextResponse.json({ error: 'Lỗi tính toán.', detail: error?.message }, { status: 500 })
  }
}
