import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/connect_Sql'

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM TeachingHistory ORDER BY calculatedAt DESC')
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn lịch sử.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { teacherId, teacherName, className, subjectName, numLessons, rateId, degreeCoeffId, classCoeffId, total, note } = await req.json()
    const [result]: any = await db.query(
      'INSERT INTO TeachingHistory (teacherId, teacherName, className, subjectName, numLessons, rateId, degreeCoeffId, classCoeffId, total, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [teacherId, teacherName, className, subjectName, numLessons, rateId, degreeCoeffId, classCoeffId, total, note]
    )
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm mới lịch sử.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    await db.query('DELETE FROM TeachingHistory WHERE id=?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa lịch sử.' }, { status: 500 })
  }
}
