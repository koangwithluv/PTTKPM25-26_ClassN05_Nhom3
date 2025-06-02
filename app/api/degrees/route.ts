import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/connect_Sql'

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM Degree')
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn dữ liệu bằng cấp.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { fullName, abbreviation } = await req.json()
    const [result]: any = await db.query(
      'INSERT INTO Degree (fullName, abbreviation) VALUES (?, ?)',
      [fullName, abbreviation]
    )
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm mới bằng cấp.' }, { status: 500 })
  }
}