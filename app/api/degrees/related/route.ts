import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

// API phụ: Lấy danh sách giáo viên liên quan đến bằng cấp
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Thiếu id bằng cấp.' }, { status: 400 })
  try {
    // Lấy danh sách giáo viên liên quan
    const [teachers]: any = await db.query('SELECT * FROM Teacher WHERE degreeId = ?', [id])
    return NextResponse.json({ teachers })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn dữ liệu liên quan.' }, { status: 500 })
  }
}
