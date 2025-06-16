import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/connect_Sql'

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM Course')
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn dữ liệu học phần.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, name, credits, coefficient, periods } = await req.json()
    if (!code || !name || !credits || !coefficient || !periods) {
      return NextResponse.json({ error: 'Thiếu thông tin học phần.' }, { status: 400 })
    }
    const [result]: any = await db.query(
      'INSERT INTO Course (code, name, credits, coefficient, periods) VALUES (?, ?, ?, ?, ?)',
      [code, name, credits, coefficient, periods]
    )
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm mới học phần.' }, { status: 500 })
  }
}