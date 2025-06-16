import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/connect_Sql'

export async function GET() {
  try {
    // Join để lấy thông tin giảng viên, lớp, học phần, kì học
    const [rows] = await db.query(`
      SELECT 
        a.id,
        t.fullName AS lecturerName,
        c.code AS classCode,
        c.name AS className,
        co.name AS courseName,
        s.name AS semesterName,
        s.id AS semesterId
      FROM Assignment a
      JOIN Teacher t ON a.lecturerId = t.id
      JOIN Class c ON a.classId = c.id
      JOIN Course co ON c.courseId = co.id
      JOIN Semester s ON c.semesterId = s.id
    `)
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn dữ liệu phân công.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { lecturerId, classId } = await req.json()
    const [result]: any = await db.query(
      'INSERT INTO Assignment (lecturerId, classId) VALUES (?, ?)',
      [lecturerId, classId]
    )
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm mới phân công.' }, { status: 500 })
  }
}