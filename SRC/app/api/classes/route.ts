import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

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

export async function PUT(req: NextRequest) {
  try {
    const { id, code, name, courseId, semesterId, students } = await req.json()
    if (!id) return NextResponse.json({ error: 'Thiếu id lớp học.' }, { status: 400 })
    await db.query(
      'UPDATE Class SET code = ?, name = ?, courseId = ?, semesterId = ?, students = ? WHERE id = ?',
      [code, name, courseId, semesterId, students, id]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật lớp học phần.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Thiếu id lớp học.' }, { status: 400 })
    // Xóa Assignment liên quan đến lớp học này
    await db.query('DELETE FROM Assignment WHERE classId = ?', [id])
    // Xóa lớp học
    await db.query('DELETE FROM Class WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa lớp học phần.' }, { status: 500 })
  }
}