import { NextRequest, NextResponse } from 'next/server'
// Update the import path to match the actual location and filename (case-sensitive)
import { db } from '../../../lib/connect_Sql'


export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM Semester')
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn dữ liệu kì học.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, academicYear, startDate, endDate } = await req.json()
    const [result]: any = await db.query(
      'INSERT INTO Semester (name, academicYear, startDate, endDate) VALUES (?, ?, ?, ?)',
      [name, academicYear, startDate, endDate]
    )
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm mới kì học.' }, { status: 500 })
  }
}