import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM Rate')
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn định mức.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, value, description } = await req.json()
    const [result]: any = await db.query(
      'INSERT INTO Rate (name, value, description) VALUES (?, ?, ?)',
      [name, value, description]
    )
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm mới định mức.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const { name, value, description } = await req.json()
    await db.query(
      'UPDATE Rate SET name=?, value=?, description=? WHERE id=?',
      [name, value, description, id]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật định mức.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    await db.query('DELETE FROM Rate WHERE id=?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa định mức.' }, { status: 500 })
  }
}
