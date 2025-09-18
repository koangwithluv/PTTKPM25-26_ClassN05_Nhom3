import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/connect_Sql'

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM DegreeCoeff')
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi truy vấn hệ số giáo viên.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { degreeName, coeff, description } = await req.json()
    const [result]: any = await db.query(
      'INSERT INTO DegreeCoeff (degreeName, coeff, description) VALUES (?, ?, ?)',
      [degreeName, coeff, description]
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
    const { degreeName, coeff, description } = await req.json()
    await db.query(
      'UPDATE DegreeCoeff SET degreeName=?, coeff=?, description=? WHERE id=?',
      [degreeName, coeff, description, id]
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
