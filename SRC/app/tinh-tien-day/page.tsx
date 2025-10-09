'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TeachingHistory {
  teacherId: number;
  teacherName: string;
  className: string;
  subjectName: string;
  academicYear: string;
  semesterName: string;
  numLessons: number;
  rateId: number | null;
  degreeCoeffId: number | null;
  classCoeffId: number | null;
  total: number;
  calculatedAt: string;
  batchId?: string | null;
}

export default function TinhTienDayPage() {
  const [history, setHistory] = useState<TeachingHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [calculating, setCalculating] = useState(false)
  const [calculationMessage, setCalculationMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    const res = await fetch('/tinh-tien-day/api/history')
    const data = await res.json()
    setHistory(data)
    setLoading(false)
  }

  const handleCalculate = async () => {
    setCalculating(true)
    setCalculationMessage(null)
    const params = new URLSearchParams()
    if (selectedYear) params.set('academicYear', selectedYear)
    if (selectedSemester) params.set('semesterName', selectedSemester)
    const response = await fetch(`/tinh-tien-day/api/calculate${params.toString() ? `?${params.toString()}` : ''}`, { method: 'POST' })
    const data = await response.json()
    if (data?.success) {
      const insertedCount = Array.isArray(data.inserted) ? data.inserted.length : 0
      const skippedCount = Array.isArray(data.skipped) ? data.skipped.length : 0
      if (insertedCount === 0) {
        setCalculationMessage('Không có thay đổi mới cần ghi nhận cho kỳ học đã chọn.')
      } else {
        const messageParts = [`Đã ghi nhận ${insertedCount} dòng mới${data.batchId ? ` (batch ${data.batchId})` : ''}.`]
        if (skippedCount > 0) {
          messageParts.push(`${skippedCount} phân công giữ nguyên dữ liệu trước đó.`)
        }
        setCalculationMessage(messageParts.join(' '))
      }
    } else if (data?.error) {
      setCalculationMessage(data.error)
    }
    await fetchHistory()
    setCalculating(false)
  }

  // Lấy danh sách năm học và kỳ học duy nhất
  const academicYears = Array.from(new Set(history.map(h => h.academicYear).filter(Boolean)))
  const semesters = Array.from(new Set(history.filter(h => !selectedYear || h.academicYear === selectedYear).map(h => h.semesterName).filter(Boolean)))

  // Lọc dữ liệu theo năm học và kỳ học
  const filteredHistory = history.filter(h =>
    (!selectedYear || h.academicYear === selectedYear) &&
    (!selectedSemester || h.semesterName === selectedSemester)
  )

  // Sử dụng bản ghi mới nhất cho mỗi giáo viên/lớp/kỳ để tránh cộng dồn lịch sử cũ
  const latestPerAssignment = new Map<string, TeachingHistory>()
  for (const entry of filteredHistory) {
    const key = `${entry.teacherId}-${entry.className}-${entry.academicYear}-${entry.semesterName}`
    const existing = latestPerAssignment.get(key)
    const entryTime = entry.calculatedAt ? new Date(entry.calculatedAt).getTime() : 0
    const existingTime = existing?.calculatedAt ? new Date(existing.calculatedAt).getTime() : 0
    if (!existing || entryTime >= existingTime) {
      latestPerAssignment.set(key, entry)
    }
  }

  const teacherSummary = Array.from(latestPerAssignment.values()).reduce((acc, row) => {
    if (!acc[row.teacherId]) {
      acc[row.teacherId] = {
        teacherName: row.teacherName,
        totalLessons: 0,
        totalMoney: 0,
      }
    }
    acc[row.teacherId].totalLessons += Number(row.numLessons) || 0
    acc[row.teacherId].totalMoney += Number(row.total) || 0
    return acc
  }, {} as Record<number, { teacherName: string; totalLessons: number; totalMoney: number }>)

  const summaryArr = Object.values(teacherSummary)

  return (
    <Card className="max-w-4xl mx-auto p-8 mt-8 bg-background border shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-primary">Bảng tổng hợp lương giáo viên</h1>
      <div className="flex gap-4 mb-4">
        <select className="border rounded px-3 py-2" value={selectedYear} onChange={e => { setSelectedYear(e.target.value); setSelectedSemester('') }}>
          <option value="">Tất cả năm học</option>
          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select className="border rounded px-3 py-2" value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
          <option value="">Tất cả kỳ học</option>
          {semesters.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <Button onClick={handleCalculate} disabled={calculating} className="h-10">
          {calculating ? 'Đang tính lương...' : 'Tính tiền dạy'}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">STT</th>
              <th className="border px-3 py-2">Tên giáo viên</th>
              <th className="border px-3 py-2">Tổng số tiết</th>
              <th className="border px-3 py-2">Tổng tiền dạy</th>
            </tr>
          </thead>
          <tbody>
            {summaryArr.map((row, idx) => (
              <tr key={row.teacherName}>
                <td className="border px-3 py-2 text-center">{idx+1}</td>
                <td className="border px-3 py-2">{row.teacherName}</td>
                <td className="border px-3 py-2 text-right">{row.totalLessons}</td>
                <td className="border px-3 py-2 text-right font-semibold">
                  {Number(row.totalMoney).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} VNĐ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {calculationMessage && (
        <div className="mt-4 text-sm text-muted-foreground">{calculationMessage}</div>
      )}
      {loading && <div className="mt-4 text-blue-600">Đang tải dữ liệu...</div>}
    </Card>
  )
}
