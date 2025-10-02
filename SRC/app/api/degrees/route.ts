import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

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

export async function PUT(req: NextRequest) {
  try {
    const { id, fullName, abbreviation } = await req.json()
    if (!id) return NextResponse.json({ error: 'Thiếu id bằng cấp.' }, { status: 400 })
    await db.query(
      'UPDATE Degree SET fullName = ?, abbreviation = ? WHERE id = ?',
      [fullName, abbreviation, id]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật bằng cấp.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Thiếu id bằng cấp.' }, { status: 400 })
    // Xóa giáo viên liên quan đến bằng cấp này (nếu muốn cứng, có thể xóa hoặc cập nhật degreeId=null)
    await db.query('DELETE FROM Teacher WHERE degreeId = ?', [id])
    // Xóa bằng cấp
    await db.query('DELETE FROM Degree WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa bằng cấp.' }, { status: 500 })
  }
}