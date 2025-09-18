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
  rateId: number;
  degreeCoeffId: number;
  classCoeffId: number;
  total: number;
  calculatedAt: string;
}

export default function TinhTienDayPage() {
  const [history, setHistory] = useState<TeachingHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [calculating, setCalculating] = useState(false)

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
    await fetch('/tinh-tien-day/api/calculate', { method: 'POST' })
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

  // Tổng hợp theo giáo viên
  const teacherSummary = filteredHistory.reduce((acc, row) => {
    if (!acc[row.teacherId]) {
      acc[row.teacherId] = {
        teacherName: row.teacherName,
        totalLessons: 0,
        totalMoney: 0
      }
    }
    acc[row.teacherId].totalLessons += Number(row.numLessons) || 0
    acc[row.teacherId].totalMoney += Number(row.total) || 0
    return acc
  }, {} as Record<number, { teacherName: string, totalLessons: number, totalMoney: number }>)

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
      {loading && <div className="mt-4 text-blue-600">Đang tải dữ liệu...</div>}
    </Card>
  )
}
