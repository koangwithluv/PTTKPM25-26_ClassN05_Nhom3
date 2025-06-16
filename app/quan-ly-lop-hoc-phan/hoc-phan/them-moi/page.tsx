"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AddCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    credits: "",
    coefficient: "",
    periods: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/coueses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.code,
          name: formData.name,
          credits: Number(formData.credits),
          coefficient: Number(formData.coefficient),
          periods: Number(formData.periods),
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Lỗi không xác định")
      router.push("/quan-ly-lop-hoc-phan/hoc-phan")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/quan-ly-lop-hoc-phan/hoc-phan">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Thêm học phần mới</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin học phần</CardTitle>
          <CardDescription>Nhập đầy đủ thông tin để tạo học phần mới</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã học phần</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Nhập mã học phần"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên học phần</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nhập tên học phần"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Số tín chỉ</Label>
                <Input
                  id="credits"
                  name="credits"
                  type="number"
                  min="1"
                  placeholder="Nhập số tín chỉ"
                  value={formData.credits}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coefficient">Hệ số học phần</Label>
                <Input
                  id="coefficient"
                  name="coefficient"
                  type="number"
                  step="0.1"
                  min="1"
                  placeholder="Nhập hệ số học phần"
                  value={formData.coefficient}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periods">Số tiết</Label>
                <Input
                  id="periods"
                  name="periods"
                  type="number"
                  min="1"
                  placeholder="Nhập số tiết"
                  value={formData.periods}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex justify-end space-x-2">
              <Link href="/quan-ly-lop-hoc-phan/hoc-phan">
                <Button variant="outline">Hủy</Button>
              </Link>
              <Button type="submit" disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
