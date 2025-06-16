'use client'

import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

interface HistoryItem {
  id: number
  teacherName: string
  className: string
  subjectName: string
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

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    const res = await fetch('/api/tinh-tien-day/history')
    const data = await res.json()
    setHistory(data)
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/tinh-tien-day/history?id=${id}`, { method: 'DELETE' })
    fetchHistory()
  }

  return (
    <Card className="max-w-5xl mx-auto p-8 mt-8 bg-background border shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-primary">Lịch sử tính tiền dạy</h1>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Giáo viên</th>
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
                <td className="border px-3 py-2">{item.teacherName}</td>
                <td className="border px-3 py-2">{item.className}</td>
                <td className="border px-3 py-2">{item.subjectName}</td>
                <td className="border px-3 py-2">{item.numLessons}</td>
                <td className="border px-3 py-2">{item.total.toLocaleString()}</td>
                <td className="border px-3 py-2">{new Date(item.calculatedAt).toLocaleString()}</td>
                <td className="border px-3 py-2">{item.note}</td>
                <td className="border px-3 py-2 flex gap-2 justify-center">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>Xóa</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
