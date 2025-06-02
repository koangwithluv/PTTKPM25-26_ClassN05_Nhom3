import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/connect_Sql'

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM Class')
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn dữ liệu lớp học phần.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, name, courseId, semesterId, students } = await req.json()
    const [result]: any = await db.query(
      'INSERT INTO Class (code, name, courseId, semesterId, students) VALUES (?, ?, ?, ?, ?)',
      [code, name, courseId, semesterId, students]
    )
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm mới lớp học phần.' }, { status: 500 })
  }
}