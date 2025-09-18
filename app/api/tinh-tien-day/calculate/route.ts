import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/connect_Sql'

export async function POST(req: NextRequest) {
  try {
    const { teacherName, className, subjectName, numLessons, rate, degreeCoeff, classCoeff } = await req.json()
    // Logic tính tiền dạy
    const total = Number(numLessons) * Number(rate) * Number(degreeCoeff) * Number(classCoeff)
    return NextResponse.json({ total })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi tính toán.' }, { status: 500 })
  }
}
