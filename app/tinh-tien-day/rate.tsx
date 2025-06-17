'use client'

import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

interface Rate {
  id: number
  name: string
  value: number
  description?: string
  appliedFrom: string
}

// Thêm interface cho lịch sử tính toán
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

export default function RatePage() {
  const [rates, setRates] = useState<Rate[]>([])
  const [form, setForm] = useState({ name: '', value: '', description: '', appliedFrom: '' })
  const [editingId, setEditingId] = useState<number|null>(null)

  // State cho tổng hợp lương giáo viên
  const [history, setHistory] = useState<TeachingHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    fetchRates()
    fetchHistory()
  }, [])

  const fetchRates = async () => {
    const res = await fetch('/api/tinh-tien-day/rate')
    const data = await res.json()
    setRates(data)
  }

  // Fetch lịch sử tính toán
  const fetchHistory = async () => {
    setLoadingHistory(true)
    const res = await fetch('/tinh-tien-day/api/history')
    const data = await res.json()
    setHistory(data)
    setLoadingHistory(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      await fetch(`/api/tinh-tien-day/rate?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    } else {
      await fetch('/api/tinh-tien-day/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    setForm({ name: '', value: '', description: '', appliedFrom: '' })
    setEditingId(null)
    fetchRates()
  }

  const handleEdit = (rate: Rate) => {
    setForm({
      name: rate.name,
      value: rate.value.toString(),
      description: rate.description || '',
      appliedFrom: rate.appliedFrom ? rate.appliedFrom.slice(0, 10) : ''
    })
    setEditingId(rate.id)
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/tinh-tien-day/rate?id=${id}`, { method: 'DELETE' })
    fetchRates()
  }

  return (
    <>
      <Card className="max-w-3xl mx-auto p-8 mt-8 bg-background border shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-primary">Quản lý định mức tiền/tiết</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4 mb-6 items-end">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Tên định mức" className="border rounded px-3 py-2 col-span-3" required />
          <input name="value" value={form.value} onChange={handleChange} placeholder="Số tiền/tiết" type="number" min="0" step="0.01" className="border rounded px-3 py-2 col-span-3" required />
          <input name="appliedFrom" value={form.appliedFrom} onChange={handleChange} placeholder="Ngày áp dụng" type="date" className="border rounded px-3 py-2 col-span-3" required />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" className="border rounded px-3 py-2 col-span-2" />
          <Button type="submit" className="col-span-1 h-10">{editingId ? 'Cập nhật' : 'Thêm mới'}</Button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Tên định mức</th>
                <th className="border px-3 py-2">Số tiền/tiết</th>
                <th className="border px-3 py-2">Ngày áp dụng</th>
                <th className="border px-3 py-2">Mô tả</th>
                <th className="border px-3 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {rates.map(rate => (
                <tr key={rate.id}>
                  <td className="border px-3 py-2">{rate.name}</td>
                  <td className="border px-3 py-2">{rate.value.toLocaleString()}</td>
                  <td className="border px-3 py-2">{rate.appliedFrom ? new Date(rate.appliedFrom).toLocaleDateString('vi-VN') : ''}</td>
                  <td className="border px-3 py-2">{rate.description}</td>
                  <td className="border px-3 py-2 flex gap-2 justify-center">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(rate)}>Sửa</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(rate.id)}>Xóa</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bảng tổng hợp lương giáo viên */}
      <Card className="max-w-4xl mx-auto p-8 mt-8 bg-background border shadow-md">
        <h2 className="text-xl font-bold mb-6 text-primary">Bảng tổng hợp lương giáo viên</h2>
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
              {Object.values(history.reduce((acc, row) => {
                if (!acc[row.teacherId]) {
                  acc[row.teacherId] = {
                    teacherName: row.teacherName,
                    totalLessons: 0,
                    totalMoney: 0
                  }
                }
                acc[row.teacherId].totalLessons += row.numLessons
                acc[row.teacherId].totalMoney += row.total
                return acc
              }, {} as Record<number, { teacherName: string, totalLessons: number, totalMoney: number }>)).map((row, idx) => (
                <tr key={row.teacherName}>
                  <td className="border px-3 py-2 text-center">{idx+1}</td>
                  <td className="border px-3 py-2">{row.teacherName}</td>
                  <td className="border px-3 py-2 text-right">{row.totalLessons}</td>
                  <td className="border px-3 py-2 text-right font-semibold">{row.totalMoney.toLocaleString()} VNĐ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loadingHistory && <div className="mt-4 text-blue-600">Đang tải dữ liệu...</div>}
      </Card>
    </>
  )
}
