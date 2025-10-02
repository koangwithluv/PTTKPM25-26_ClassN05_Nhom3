import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

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

export async function PUT(req: NextRequest) {
  try {
    const { id, code, name, credits, coefficient, periods } = await req.json()
    if (!id) return NextResponse.json({ error: 'Thiếu id học phần.' }, { status: 400 })
    await db.query(
      'UPDATE Course SET code = ?, name = ?, credits = ?, coefficient = ?, periods = ? WHERE id = ?',
      [code, name, credits, coefficient, periods, id]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật học phần.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Thiếu id học phần.' }, { status: 400 })

    // Lấy danh sách lớp học liên quan
    const [classes]: any = await db.query('SELECT id FROM Class WHERE courseId = ?', [id])
    const classIds = classes.map((c: any) => c.id)

    // Xóa Assignment liên quan
    if (classIds.length > 0) {
      await db.query(`DELETE FROM Assignment WHERE classId IN (${classIds.map(() => '?').join(',')})`, classIds)
      // Xóa Class liên quan
      await db.query(`DELETE FROM Class WHERE id IN (${classIds.map(() => '?').join(',')})`, classIds)
    }
    // Xóa Course
    await db.query('DELETE FROM Course WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    // Log chi tiết lỗi trả về cho client
    return NextResponse.json({ error: 'Lỗi xóa học phần.', details: error?.message || error }, { status: 500 })
  }
}