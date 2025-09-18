'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ClassCoeff {
  id: number
  minStudents: number
  maxStudents: number
  coeff: number
}

export default function ClassCoeffPage() {
  const [coeffs, setCoeffs] = useState<ClassCoeff[]>([])
  const [editingId, setEditingId] = useState<number|null>(null)
  const [editingCoeff, setEditingCoeff] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ minStudents: '', maxStudents: '', coeff: '' })

  useEffect(() => {
    fetchCoeffs()
  }, [])

  const fetchCoeffs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/tinh-tien-day/class-coeff')
      if (!res.ok) throw new Error('Lỗi khi tải dữ liệu')
      const data = await res.json()
      setCoeffs(data)
    } catch (e: any) {
      setError(e.message || 'Lỗi không xác định')
    }
    setLoading(false)
  }

  const handleEdit = (coeff: ClassCoeff) => {
    setEditingId(coeff.id)
    setEditingCoeff(coeff.coeff.toString())
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingCoeff(e.target.value)
  }

  const handleSave = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const payload = { coeff: Number(editingCoeff) }
      const res = await fetch(`/api/tinh-tien-day/class-coeff?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Lỗi cập nhật')
      }
      setEditingId(null)
      setEditingCoeff('')
      fetchCoeffs()
    } catch (e: any) {
      setError(e.message || 'Lỗi không xác định')
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditingCoeff('')
  }

  // Thêm mới hệ số lớp
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value })
  }
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        minStudents: Number(addForm.minStudents),
        maxStudents: Number(addForm.maxStudents),
        coeff: Number(addForm.coeff)
      }
      const res = await fetch('/api/tinh-tien-day/class-coeff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Lỗi thêm mới')
      }
      setShowAdd(false)
      setAddForm({ minStudents: '', maxStudents: '', coeff: '' })
      fetchCoeffs()
    } catch (e: any) {
      setError(e.message || 'Lỗi không xác định')
    }
    setLoading(false)
  }

  return (
    <Card className="max-w-2xl mx-auto p-8 mt-8 bg-background border shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-primary">Hệ số lớp theo số sinh viên</h1>
      <div className="mb-4 flex justify-end">
        {!showAdd ? (
          <Button size="sm" onClick={() => setShowAdd(true)}>+ Thêm mới hệ số lớp</Button>
        ) : (
          <form className="flex gap-2 items-end" onSubmit={handleAddSubmit}>
            <Input
              name="minStudents"
              value={addForm.minStudents}
              onChange={handleAddChange}
              placeholder="Số SV từ"
              type="number"
              min={0}
              className="w-28"
              required
            />
            <Input
              name="maxStudents"
              value={addForm.maxStudents}
              onChange={handleAddChange}
              placeholder="Số SV đến"
              type="number"
              min={0}
              className="w-28"
              required
            />
            <Input
              name="coeff"
              value={addForm.coeff}
              onChange={handleAddChange}
              placeholder="Hệ số lớp"
              type="number"
              step="0.01"
              className="w-28"
              required
            />
            <Button size="sm" type="submit" disabled={loading}>Lưu</Button>
            <Button size="sm" variant="outline" type="button" onClick={() => { setShowAdd(false); setAddForm({ minStudents: '', maxStudents: '', coeff: '' }) }} disabled={loading}>Hủy</Button>
          </form>
        )}
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading && <div className="mb-4 text-blue-600">Đang tải dữ liệu...</div>}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-center">Khoảng số sinh viên</th>
              <th className="border px-3 py-2 text-center">Hệ số lớp</th>
              <th className="border px-3 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {coeffs.map((coeff) => (
              <tr key={coeff.id}>
                <td className="border px-3 py-2 text-center">
                  {coeff.minStudents} - {coeff.maxStudents}
                </td>
                <td className="border px-3 py-2 text-center">
                  {editingId === coeff.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editingCoeff}
                      onChange={handleChange}
                      className="w-24 mx-auto text-center"
                      autoFocus
                    />
                  ) : (
                    coeff.coeff
                  )}
                </td>
                <td className="border px-3 py-2 text-center">
                  {editingId === coeff.id ? (
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" onClick={() => handleSave(coeff.id)} disabled={loading}>Lưu</Button>
                      <Button size="sm" variant="outline" onClick={handleCancel} disabled={loading}>Hủy</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(coeff)} disabled={loading}>Sửa</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
