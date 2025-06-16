'use client'
import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

interface Teacher {
  id: number;
  fullName: string;
  degreeId: number;
  code: string;
  email: string;
  phone: string;
}
interface DegreeCoeff { id: number; degreeName: string; coeff: number; }
interface Rate { id: number; value: number; name: string; }
interface ClassCoeff { id: number; coeff: number; classType: string; }
interface TeachingHistory {
  teacherId: number;
  teacherName: string;
  className: string;
  subjectName: string;
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

  return (
    <Card className="max-w-6xl mx-auto p-8 mt-8 bg-background border shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-primary">Bảng tính tiền dạy giáo viên (từ lịch sử tính toán)</h1>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">STT</th>
              <th className="border px-3 py-2">Tên giáo viên</th>
              <th className="border px-3 py-2">Lớp</th>
              <th className="border px-3 py-2">Môn học</th>
              <th className="border px-3 py-2">Số tiết</th>
              <th className="border px-3 py-2">Tổng tiền dạy</th>
              <th className="border px-3 py-2">Ngày tính</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, idx) => (
              <tr key={row.teacherId + row.className + row.subjectName + row.calculatedAt}>
                <td className="border px-3 py-2 text-center">{idx+1}</td>
                <td className="border px-3 py-2">{row.teacherName}</td>
                <td className="border px-3 py-2">{row.className}</td>
                <td className="border px-3 py-2">{row.subjectName}</td>
                <td className="border px-3 py-2 text-right">{row.numLessons}</td>
                <td className="border px-3 py-2 text-right font-semibold">{row.total.toLocaleString()} VNĐ</td>
                <td className="border px-3 py-2">{new Date(row.calculatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <div className="mt-4 text-blue-600">Đang tải dữ liệu...</div>}
    </Card>
  )
}
