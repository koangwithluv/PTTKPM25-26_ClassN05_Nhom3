import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

export async function POST(req: NextRequest) {
  try {
    let body = null
    try {
      body = await req.json()
    } catch (e) {
      // Nếu không có body, sẽ tính tổng hợp
    }

    // Nếu có body (tính lương cho 1 trường hợp), giữ nguyên logic cũ
    if (body && Object.keys(body).length > 0) {
      const { teacherName, className, subjectName, numLessons, rate, degreeCoeff, classCoeff, courseCoeff } = body
      // Số tiết quy đổi = số tiết thực tế * (hệ số học phần + hệ số lớp)
      const soTietQuyDoi = Number(numLessons) * (Number(courseCoeff) + Number(classCoeff))
      // Tổng tiền = số tiết quy đổi * hệ số giáo viên * tiền dạy một tiết
      const total = soTietQuyDoi * Number(degreeCoeff) * Number(rate)
      return NextResponse.json({ total })
    }

    // XÓA TOÀN BỘ LỊCH SỬ TRƯỚC KHI TÍNH LẠI
    await db.query('DELETE FROM TeachingHistory')

    // Nếu không có body, thực hiện tính lương tổng hợp cho toàn bộ giáo viên
    // 1. Lấy danh sách phân công, lớp học, giáo viên, hệ số lớp, hệ số giáo viên, định mức, năm học, kỳ học, hệ số học phần
    const [assignmentsRaw] = await db.query(`
      SELECT a.*, t.fullName as teacherName, t.degreeId, c.id as classId, c.name as className, c.courseId, c.students,
             co.name as subjectName, co.periods, co.coefficient as courseCoeff, s.academicYear, s.name as semesterName
      FROM Assignment a
      JOIN Teacher t ON a.lecturerId = t.id
      JOIN Class c ON a.classId = c.id
      JOIN Course co ON c.courseId = co.id
      JOIN Semester s ON c.semesterId = s.id
    `)
    const assignments = assignmentsRaw as any[]
    const [degreeCoeffsRaw] = await db.query('SELECT * FROM DegreeCoeff')
    const degreeCoeffs = degreeCoeffsRaw as any[]
    const [classCoeffsRaw] = await db.query('SELECT * FROM ClassCoeff')
    const classCoeffs = classCoeffsRaw as any[]
    const [ratesRaw] = await db.query('SELECT * FROM Rate ORDER BY appliedFrom DESC')
    const rates = ratesRaw as any[]

    // 2. Tính lương cho từng assignment
    const results = []
    for (const a of assignments) {
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
      // Ghi vào TeachingHistory (thêm academicYear, semesterName)
      await db.query(
        'INSERT INTO TeachingHistory (teacherId, teacherName, className, subjectName, academicYear, semesterName, numLessons, rateId, degreeCoeffId, classCoeffId, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [a.lecturerId, a.teacherName, a.className, a.subjectName, a.academicYear, a.semesterName, numLessons, rateId, degreeCoeffId, classCoeffId, total]
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
        total
      })
    }
    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Lỗi khi tính lương tổng hợp:', error)
    return NextResponse.json({ error: 'Lỗi tính toán.', detail: error?.message }, { status: 500 })
  }
}
