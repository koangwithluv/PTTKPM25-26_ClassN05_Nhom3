import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM ClassCoeff')
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn hệ số lớp.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    let { minStudents, maxStudents, coeff, description } = await req.json()
    if (description === undefined) description = ''
    const [result]: any = await db.query(
      'INSERT INTO ClassCoeff (minStudents, maxStudents, coeff, description) VALUES (?, ?, ?, ?)',
      [minStudents, maxStudents, coeff, description]
    )
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm mới hệ số lớp.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const { minStudents, maxStudents, coeff, description } = await req.json()
    await db.query(
      'UPDATE ClassCoeff SET minStudents=?, maxStudents=?, coeff=?, description=? WHERE id=?',
      [minStudents, maxStudents, coeff, description, id]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật hệ số lớp.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    await db.query('DELETE FROM ClassCoeff WHERE id=?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa hệ số lớp.' }, { status: 500 })
  }
}
