import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

export async function GET() {
  try {
    // Join để lấy cả tên bằng cấp nếu cần
    const [rows] = await db.query(`
      SELECT dc.id, dc.degreeId, d.fullName as degreeName, dc.coeff, dc.description
      FROM DegreeCoeff dc
      JOIN Degree d ON dc.degreeId = d.id
    `)
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn hệ số giáo viên.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { degreeId, coeff, description } = await req.json()
    const [result]: any = await db.query(
      'INSERT INTO DegreeCoeff (degreeId, coeff, description) VALUES (?, ?, ?)',
      [degreeId, coeff, description]
    )
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm mới hệ số giáo viên.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const { degreeId, coeff, description } = await req.json()
    await db.query(
      'UPDATE DegreeCoeff SET degreeId=?, coeff=?, description=? WHERE id=?',
      [degreeId, coeff, description, id]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật hệ số giáo viên.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    await db.query('DELETE FROM DegreeCoeff WHERE id=?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa hệ số giáo viên.' }, { status: 500 })
  }
}
