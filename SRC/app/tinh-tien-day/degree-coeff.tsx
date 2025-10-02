'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Degree {
  id: number
  fullName: string
  abbreviation: string
}
interface DegreeCoeff {
  id?: number
  degreeId: number
  coeff: number
  description?: string
  degreeName?: string // lấy từ API join
}

export default function DegreeCoeffPage() {
  const [degrees, setDegrees] = useState<Degree[]>([])
  const [degreeCoeffs, setDegreeCoeffs] = useState<DegreeCoeff[]>([])
  const [editing, setEditing] = useState<{degreeId: number, coeff: string, description: string, id?: number, degreeName?: string}|null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [degRes, coeffRes] = await Promise.all([
      fetch('/api/degrees'),
      fetch('/tinh-tien-day/api/degree-coeff'),
    ])
    const [degrees, coeffs] = await Promise.all([degRes.json(), coeffRes.json()])
    setDegrees(degrees)
    setDegreeCoeffs(coeffs)
    setLoading(false)
  }

  const getCoeff = (degreeId: number) => degreeCoeffs.find(c => c.degreeId === degreeId)

  const handleEdit = (degree: Degree) => {
    const coeffObj = getCoeff(degree.id)
    setEditing({
      degreeId: degree.id,
      coeff: coeffObj ? coeffObj.coeff.toString() : '',
      description: coeffObj?.description || '',
      id: coeffObj?.id,
      degreeName: degree.fullName
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return
    setEditing({ ...editing, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setLoading(true)
    const payload = {
      degreeId: editing.degreeId,
      coeff: editing.coeff,
      description: editing.description
    }
    if (editing.id) {
      await fetch(`/tinh-tien-day/api/degree-coeff?id=${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    } else {
      await fetch('/tinh-tien-day/api/degree-coeff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    }
    setEditing(null)
    fetchAll()
    setLoading(false)
  }

  return (
    <Card className="max-w-3xl mx-auto p-8 mt-8 bg-background border shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-primary">Quản lý hệ số tính tiền lương theo bằng cấp</h1>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">STT</th>
              <th className="border px-3 py-2">Tên bằng cấp/học vị</th>
              <th className="border px-3 py-2">Viết tắt</th>
              <th className="border px-3 py-2">Hệ số</th>
              <th className="border px-3 py-2">Mô tả</th>
              <th className="border px-3 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {degrees.map((deg, idx) => {
              const coeffObj = getCoeff(deg.id)
              return (
                <tr key={deg.id}>
                  <td className="border px-3 py-2 text-center">{idx+1}</td>
                  <td className="border px-3 py-2">{deg.fullName}</td>
                  <td className="border px-3 py-2">{deg.abbreviation}</td>
                  <td className="border px-3 py-2 text-right">{coeffObj ? coeffObj.coeff : ''}</td>
                  <td className="border px-3 py-2">{coeffObj?.description || ''}</td>
                  <td className="border px-3 py-2 flex gap-2 justify-center">
                    <Button size="sm" variant="outline" type="button" onClick={() => handleEdit(deg)}>Sửa</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md min-w-[320px]">
            <h2 className="font-bold mb-4">Sửa hệ số tính tiền lương</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="degreeName" value={editing.degreeName} readOnly className="border rounded px-3 py-2 w-full" />
              <input name="coeff" value={editing.coeff} onChange={handleChange} placeholder="Hệ số" type="number" min="0" step="0.01" className="border rounded px-3 py-2 w-full" required />
              <input name="description" value={editing.description} onChange={handleChange} placeholder="Mô tả" className="border rounded px-3 py-2 w-full" />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" type="button" onClick={() => setEditing(null)}>Hủy</Button>
                <Button type="submit">Lưu</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading && <div className="mt-4 text-blue-600">Đang tải dữ liệu...</div>}
    </Card>
  )
}
