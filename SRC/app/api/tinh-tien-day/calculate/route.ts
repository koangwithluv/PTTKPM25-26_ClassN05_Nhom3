import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { numLessons, rate, degreeCoeff, classCoeff, courseCoeff } = await req.json()
    const numLessonsValue = Number(numLessons)
    if (!Number.isFinite(numLessonsValue)) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ', detail: 'Số tiết phải là số hợp lệ.' }, { status: 400 })
    }

    const classCoeffValue = Number(classCoeff)
    const normalizedClassCoeff = Number.isFinite(classCoeffValue) ? classCoeffValue : 0
    const courseCoeffValue = Number(courseCoeff)
    const normalizedCourseCoeff = Number.isFinite(courseCoeffValue) ? courseCoeffValue : 0
    const degreeCoeffValue = Number(degreeCoeff)
    const normalizedDegreeCoeff = Number.isFinite(degreeCoeffValue) ? degreeCoeffValue : 0
    const rateValue = Number(rate)
    const normalizedRate = Number.isFinite(rateValue) ? rateValue : 0

    // Số tiết quy đổi = số tiết thực tế * (hệ số học phần + hệ số lớp)
    const soTietQuyDoi = numLessonsValue * (normalizedCourseCoeff + normalizedClassCoeff)
    // Tổng tiền = số tiết quy đổi * hệ số giáo viên * tiền dạy một tiết
    const total = soTietQuyDoi * normalizedDegreeCoeff * normalizedRate
    if (!Number.isFinite(total)) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ', detail: 'Không thể tính tổng tiền với dữ liệu hiện tại.' }, { status: 400 })
    }
    return NextResponse.json({ total })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi tính toán.' }, { status: 500 })
  }
}
