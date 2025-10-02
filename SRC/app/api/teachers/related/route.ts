import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

// API phụ: Lấy danh sách phân công liên quan đến giáo viên
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Thiếu id giáo viên.' }, { status: 400 })
  try {
    // Lấy danh sách phân công liên quan
    const [assignments]: any = await db.query('SELECT * FROM Assignment WHERE lecturerId = ?', [id])
    return NextResponse.json({ assignments })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn dữ liệu liên quan.' }, { status: 500 })
  }
}
