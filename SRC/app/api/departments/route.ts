import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM Department')
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn dữ liệu khoa.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { fullName, abbreviation, description } = await req.json()
    const [result]: any = await db.query(
      'INSERT INTO Department (fullName, abbreviation, description) VALUES (?, ?, ?)',
      [fullName, abbreviation, description]
    )
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm mới khoa.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, fullName, abbreviation, description } = await req.json()
    if (!id) return NextResponse.json({ error: 'Thiếu id khoa.' }, { status: 400 })
    await db.query(
      'UPDATE Department SET fullName = ?, abbreviation = ?, description = ? WHERE id = ?',
      [fullName, abbreviation, description, id]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật khoa.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Thiếu id khoa.' }, { status: 400 })
    await db.query('DELETE FROM Department WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa khoa.' }, { status: 500 })
  }
}