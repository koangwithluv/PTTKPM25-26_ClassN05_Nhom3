import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/connect_Sql'

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM Teacher')
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn dữ liệu giáo viên.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, fullName, dateOfBirth, phone, email, departmentId, degreeId } = await req.json()
    const [result]: any = await db.query(
      'INSERT INTO Teacher (code, fullName, dateOfBirth, phone, email, departmentId, degreeId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [code, fullName, dateOfBirth, phone, email, departmentId, degreeId]
    )
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm mới giáo viên.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Thiếu id giáo viên.' }, { status: 400 })
    // Xóa Assignment liên quan đến giáo viên này
    await db.query('DELETE FROM Assignment WHERE lecturerId = ?', [id])
    // Xóa giáo viên
    await db.query('DELETE FROM Teacher WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa giáo viên.' }, { status: 500 })
  }
}