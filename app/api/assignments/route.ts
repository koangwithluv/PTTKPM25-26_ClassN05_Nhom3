import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/connect_Sql'

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM Assignment')
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