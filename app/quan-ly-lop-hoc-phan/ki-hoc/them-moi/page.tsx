"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AddSemesterPage() {
  const [formData, setFormData] = useState({
    name: "",
    academicYear: "",
    startDate: "",
    endDate: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Xử lý thêm kì học mới
    console.log("Submitted:", formData)
    // Sau khi thêm thành công, chuyển hướng về trang danh sách
    // router.push("/quan-ly-lop-hoc-phan/ki-hoc")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/quan-ly-lop-hoc-phan/ki-hoc">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Thêm kì học mới</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin kì học</CardTitle>
          <CardDescription>Nhập đầy đủ thông tin để tạo kì học mới</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên kì học</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ví dụ: Học kỳ 1"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicYear">Năm học</Label>
                <Input
                  id="academicYear"
                  name="academicYear"
                  placeholder="Ví dụ: 2023-2024"
                  value={formData.academicYear}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Link href="/quan-ly-lop-hoc-phan/ki-hoc">
                <Button variant="outline">Hủy</Button>
              </Link>
              <Button type="submit">Lưu</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
