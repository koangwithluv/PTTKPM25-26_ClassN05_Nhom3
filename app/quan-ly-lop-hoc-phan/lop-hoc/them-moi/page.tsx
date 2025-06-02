"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Dữ liệu mẫu cho học phần
const courses = [
  { id: 1, code: "IT001", name: "Nhập môn lập trình" },
  { id: 2, code: "IT002", name: "Lập trình hướng đối tượng" },
  { id: 3, code: "IT003", name: "Cấu trúc dữ liệu và giải thuật" },
  { id: 4, code: "IT004", name: "Cơ sở dữ liệu" },
  { id: 5, code: "IT005", name: "Mạng máy tính" },
]

// Dữ liệu mẫu cho kì học
const semesters = [
  { id: 1, name: "Học kỳ 1", academicYear: "2023-2024" },
  { id: 2, name: "Học kỳ 2", academicYear: "2023-2024" },
  { id: 3, name: "Học kỳ hè", academicYear: "2023-2024" },
]

export default function AddClassPage() {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    courseId: "",
    semesterId: "",
    students: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Xử lý thêm lớp học mới
    console.log("Submitted:", formData)
    // Sau khi thêm thành công, chuyển hướng về trang danh sách
    // router.push("/quan-ly-lop-hoc-phan/lop-hoc")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/quan-ly-lop-hoc-phan/lop-hoc">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Thêm lớp học mới</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin lớp học</CardTitle>
          <CardDescription>Nhập đầy đủ thông tin để tạo lớp học mới</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã lớp</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Ví dụ: IT001.1"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên lớp</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ví dụ: Nhập môn lập trình - Nhóm 1"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseId">Học phần</Label>
                <Select value={formData.courseId} onValueChange={(value) => handleSelectChange("courseId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn học phần" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semesterId">Kì học</Label>
                <Select value={formData.semesterId} onValueChange={(value) => handleSelectChange("semesterId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kì học" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id.toString()}>
                        {semester.name} ({semester.academicYear})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="students">Số sinh viên</Label>
                <Input
                  id="students"
                  name="students"
                  type="number"
                  min="1"
                  placeholder="Nhập số sinh viên"
                  value={formData.students}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Link href="/quan-ly-lop-hoc-phan/lop-hoc">
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
