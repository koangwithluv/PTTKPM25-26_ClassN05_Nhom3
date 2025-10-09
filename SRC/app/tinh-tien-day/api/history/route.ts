import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

interface TeachingHistoryRow extends RowDataPacket {
  id: number
  batchId: string
  teacherId: number
  teacherName: string
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
  note: string | null
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const academicYear = searchParams.get('academicYear')
    const semesterName = searchParams.get('semesterName')
    const batchId = searchParams.get('batchId')

    let query = 'SELECT * FROM TeachingHistory WHERE 1=1'
    const params: Array<string | number> = []

    if (academicYear) {
      query += ' AND academicYear = ?'
      params.push(academicYear)
    }

    if (semesterName) {
      query += ' AND semesterName = ?'
      params.push(semesterName)
    }

    if (batchId) {
      query += ' AND batchId = ?'
      params.push(batchId)
    }

    query += ' ORDER BY calculatedAt DESC'

    const [rows] = await db.query<TeachingHistoryRow[]>(query, params)
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn lịch sử.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      teacherId,
      teacherName,
      className,
      subjectName,
      academicYear,
      semesterName,
      numLessons,
      rateId,
      degreeCoeffId,
      classCoeffId,
      total,
      note,
      batchId,
    } = await req.json()

    if (!academicYear || !semesterName) {
      return NextResponse.json({ error: 'Thiếu thông tin năm học hoặc kỳ học.' }, { status: 400 })
    }

    if (!batchId) {
      return NextResponse.json({ error: 'Thiếu thông tin batchId.' }, { status: 400 })
    }

  const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO TeachingHistory (teacherId, teacherName, className, subjectName, academicYear, semesterName, numLessons, rateId, degreeCoeffId, classCoeffId, total, note, batchId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        teacherId,
        teacherName,
        className,
        subjectName,
        academicYear,
        semesterName,
        numLessons,
        rateId,
        degreeCoeffId,
        classCoeffId,
        total,
        note,
        batchId,
      ]
    )
  return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm mới lịch sử.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    await db.query('DELETE FROM TeachingHistory WHERE id=?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa lịch sử.' }, { status: 500 })
  }
}
