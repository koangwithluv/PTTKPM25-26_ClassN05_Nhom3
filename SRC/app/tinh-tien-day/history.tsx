'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface HistoryItem {
  id: number
  batchId: string
  teacherName: string
  className: string
  subjectName: string
  academicYear: string
  semesterName: string
  numLessons: number
  rateId: number
  degreeCoeffId: number
  classCoeffId: number
  total: number
  calculatedAt: string
  note?: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [selectedBatch, setSelectedBatch] = useState<string>('')

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    const query = new URLSearchParams()
    if (selectedYear) {
      query.set('academicYear', selectedYear)
    }
    if (selectedSemester) {
      query.set('semesterName', selectedSemester)
    }
    if (selectedBatch) {
      query.set('batchId', selectedBatch)
    }
    const url = query.toString() ? `/api/tinh-tien-day/history?${query.toString()}` : '/api/tinh-tien-day/history'
    const res = await fetch(url)
    const data = await res.json()
    setHistory(data)
    setLoading(false)
  }, [selectedYear, selectedSemester, selectedBatch])

  useEffect(() => {
    void fetchHistory()
  }, [fetchHistory])

  const handleDelete = async (id: number) => {
    await fetch(`/api/tinh-tien-day/history?id=${id}`, { method: 'DELETE' })
    await fetchHistory()
  }

  const academicYears = Array.from(new Set(history.map(item => item.academicYear).filter(Boolean)))
  const semesters = Array.from(new Set(history.map(item => item.semesterName).filter(Boolean)))
  const batches = Array.from(new Set(history.map(item => item.batchId).filter(Boolean)))

  return (
    <Card className="max-w-6xl mx-auto p-8 mt-8 bg-background border shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-primary">Lịch sử tính tiền dạy theo kỳ và năm học</h1>
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Năm học:</label>
          <select
            className="border rounded px-3 py-2"
            value={selectedYear}
            onChange={e => {
              setSelectedYear(e.target.value)
              setSelectedSemester('')
              setSelectedBatch('')
            }}
          >
            <option value="">Tất cả</option>
            {academicYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Kỳ học:</label>
          <select
            className="border rounded px-3 py-2"
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
          >
            <option value="">Tất cả</option>
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Batch:</label>
          <select
            className="border rounded px-3 py-2"
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
          >
            <option value="">Tất cả</option>
            {batches.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSelectedYear('')
            setSelectedSemester('')
            setSelectedBatch('')
          }}
        >
          Xóa bộ lọc
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Batch</th>
              <th className="border px-3 py-2">Giáo viên</th>
              <th className="border px-3 py-2">Năm học</th>
              <th className="border px-3 py-2">Kỳ học</th>
              <th className="border px-3 py-2">Lớp</th>
              <th className="border px-3 py-2">Môn học</th>
              <th className="border px-3 py-2">Số tiết</th>
              <th className="border px-3 py-2">Tổng tiền</th>
              <th className="border px-3 py-2">Ngày tính</th>
              <th className="border px-3 py-2">Ghi chú</th>
              <th className="border px-3 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <tr key={item.id}>
                <td className="border px-3 py-2 font-mono text-xs">{item.batchId}</td>
                <td className="border px-3 py-2">{item.teacherName}</td>
                <td className="border px-3 py-2 text-center">{item.academicYear}</td>
                <td className="border px-3 py-2 text-center">{item.semesterName}</td>
                <td className="border px-3 py-2">{item.className}</td>
                <td className="border px-3 py-2">{item.subjectName}</td>
                <td className="border px-3 py-2 text-right">{item.numLessons}</td>
                <td className="border px-3 py-2 text-right">{Number(item.total).toLocaleString('vi-VN')}</td>
                <td className="border px-3 py-2">{item.calculatedAt ? new Date(item.calculatedAt).toLocaleString('vi-VN') : ''}</td>
                <td className="border px-3 py-2">{item.note}</td>
                <td className="border px-3 py-2 flex gap-2 justify-center">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>Xóa</Button>
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
