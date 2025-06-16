'use client'

import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

interface Rate {
  id: number
  name: string
  value: number
  description?: string
}

export default function RatePage() {
  const [rates, setRates] = useState<Rate[]>([])
  const [form, setForm] = useState({ name: '', value: '', description: '' })
  const [editingId, setEditingId] = useState<number|null>(null)

  useEffect(() => {
    fetchRates()
  }, [])

  const fetchRates = async () => {
    const res = await fetch('/api/tinh-tien-day/rate')
    const data = await res.json()
    setRates(data)
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
    setForm({ name: '', value: '', description: '' })
    setEditingId(null)
    fetchRates()
  }

  const handleEdit = (rate: Rate) => {
    setForm({ name: rate.name, value: rate.value.toString(), description: rate.description || '' })
    setEditingId(rate.id)
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/tinh-tien-day/rate?id=${id}`, { method: 'DELETE' })
    fetchRates()
  }

  return (
    <Card className="max-w-3xl mx-auto p-8 mt-8 bg-background border shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-primary">Quản lý định mức tiền/tiết</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4 mb-6 items-end">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Tên định mức" className="border rounded px-3 py-2 col-span-4" required />
        <input name="value" value={form.value} onChange={handleChange} placeholder="Số tiền/tiết" type="number" min="0" step="0.01" className="border rounded px-3 py-2 col-span-3" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" className="border rounded px-3 py-2 col-span-3" />
        <Button type="submit" className="col-span-2 h-10">{editingId ? 'Cập nhật' : 'Thêm mới'}</Button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Tên định mức</th>
              <th className="border px-3 py-2">Số tiền/tiết</th>
              <th className="border px-3 py-2">Mô tả</th>
              <th className="border px-3 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rates.map(rate => (
              <tr key={rate.id}>
                <td className="border px-3 py-2">{rate.name}</td>
                <td className="border px-3 py-2">{rate.value.toLocaleString()}</td>
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
  )
}
