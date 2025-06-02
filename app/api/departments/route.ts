import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/connect_Sql'

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