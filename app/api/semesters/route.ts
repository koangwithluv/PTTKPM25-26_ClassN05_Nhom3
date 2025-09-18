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

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Thiếu id kì học.' }, { status: 400 })
    // Lấy danh sách lớp học thuộc kỳ học này
    const [classes]: any = await db.query('SELECT id FROM Class WHERE semesterId = ?', [id])
    const classIds = classes.map((c: any) => c.id)
    // Xóa Assignment liên quan
    if (classIds.length > 0) {
      await db.query(`DELETE FROM Assignment WHERE classId IN (${classIds.map(() => '?').join(',')})`, classIds)
      // Xóa Class liên quan
      await db.query(`DELETE FROM Class WHERE id IN (${classIds.map(() => '?').join(',')})`, classIds)
    }
    // Xóa Semester
    await db.query('DELETE FROM Semester WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa kì học.' }, { status: 500 })
  }
}