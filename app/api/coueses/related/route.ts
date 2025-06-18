import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/connect_Sql'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Thiếu id học phần.' }, { status: 400 })
  try {
    // Lấy danh sách lớp học liên quan
    const [classes]: any = await db.query('SELECT * FROM Class WHERE courseId = ?', [id])
    // Lấy danh sách phân công liên quan đến các lớp học này
    let assignments: any[] = []
    if (classes.length > 0) {
      const classIds = classes.map((c: any) => c.id)
      const [asgs]: any = await db.query(`SELECT * FROM Assignment WHERE classId IN (${classIds.map(() => '?').join(',')})`, classIds)
      assignments = asgs
    }
    return NextResponse.json({ classes, assignments })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn dữ liệu liên quan.' }, { status: 500 })
  }
}
