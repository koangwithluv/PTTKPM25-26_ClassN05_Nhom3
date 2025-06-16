'use client'

import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

interface ClassCoeff {
  id: number
  minStudents: number
  maxStudents: number
  coeff: number
  description?: string
}

export default function ClassCoeffPage() {
  const [coeffs, setCoeffs] = useState<ClassCoeff[]>([])
  const [form, setForm] = useState({ minStudents: '', maxStudents: '', coeff: '', description: '' })
  const [editingId, setEditingId] = useState<number|null>(null)

  useEffect(() => {
    fetchCoeffs()
  }, [])

  const fetchCoeffs = async () => {
    const res = await fetch('/api/tinh-tien-day/class-coeff')
    const data = await res.json()
    setCoeffs(data)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      minStudents: Number(form.minStudents),
      maxStudents: Number(form.maxStudents),
      coeff: Number(form.coeff),
      description: form.description
    }
    if (editingId) {
      await fetch(`/api/tinh-tien-day/class-coeff?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    } else {
      await fetch('/api/tinh-tien-day/class-coeff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    }
    setForm({ minStudents: '', maxStudents: '', coeff: '', description: '' })
    setEditingId(null)
    fetchCoeffs()
  }

  const handleEdit = (coeff: ClassCoeff) => {
    setForm({
      minStudents: coeff.minStudents.toString(),
      maxStudents: coeff.maxStudents.toString(),
      coeff: coeff.coeff.toString(),
      description: coeff.description || ''
    })
    setEditingId(coeff.id)
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/tinh-tien-day/class-coeff?id=${id}`, { method: 'DELETE' })
    fetchCoeffs()
  }

  return (
    <Card className="max-w-3xl mx-auto p-8 mt-8 bg-background border shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-primary">Quản lý hệ số lớp theo số sinh viên</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4 mb-6 items-end">
        <input name="minStudents" value={form.minStudents} onChange={handleChange} placeholder="Số SV từ" type="number" min="0" className="border rounded px-3 py-2 col-span-2" required />
        <input name="maxStudents" value={form.maxStudents} onChange={handleChange} placeholder="Số SV đến" type="number" min="0" className="border rounded px-3 py-2 col-span-2" required />
        <input name="coeff" value={form.coeff} onChange={handleChange} placeholder="Hệ số" type="number" step="0.01" className="border rounded px-3 py-2 col-span-2" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" className="border rounded px-3 py-2 col-span-4" />
        <Button type="submit" className="col-span-2 h-10">{editingId ? 'Cập nhật' : 'Thêm mới'}</Button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">STT</th>
              <th className="border px-3 py-2">Số SV từ</th>
              <th className="border px-3 py-2">Số SV đến</th>
              <th className="border px-3 py-2">Hệ số</th>
              <th className="border px-3 py-2">Mô tả</th>
              <th className="border px-3 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {coeffs.map((coeff, idx) => (
              <tr key={coeff.id}>
                <td className="border px-3 py-2 text-center">{idx+1}</td>
                <td className="border px-3 py-2 text-center">{coeff.minStudents}</td>
                <td className="border px-3 py-2 text-center">{coeff.maxStudents}</td>
                <td className="border px-3 py-2 text-right">{coeff.coeff}</td>
                <td className="border px-3 py-2">{coeff.description}</td>
                <td className="border px-3 py-2 flex gap-2 justify-center">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(coeff)}>Sửa</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(coeff.id)}>Xóa</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
