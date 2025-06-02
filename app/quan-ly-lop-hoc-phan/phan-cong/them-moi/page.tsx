"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Dữ liệu mẫu cho giảng viên
const lecturers = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Lê Văn C" },
  { id: 4, name: "Phạm Thị D" },
  { id: 5, name: "Hoàng Văn E" },
]

// Dữ liệu mẫu cho lớp học
const classes = [
  { id: 1, code: "IT001.1", name: "Nhập môn lập trình - Nhóm 1", course: "IT001", semester: "HK1 2023-2024" },
  { id: 2, code: "IT001.2", name: "Nhập môn lập trình - Nhóm 2", course: "IT001", semester: "HK1 2023-2024" },
  { id: 3, code: "IT002.1", name: "Lập trình hướng đối tượng - Nhóm 1", course: "IT002", semester: "HK1 2023-2024" },
  {
    id: 4,
    code: "IT003.1",
    name: "Cấu trúc dữ liệu và giải thuật - Nhóm 1",
    course: "IT003",
    semester: "HK2 2023-2024",
  },
  { id: 5, code: "IT004.1", name: "Cơ sở dữ liệu - Nhóm 1", course: "IT004", semester: "HK2 2023-2024" },
]

export default function AddAssignmentPage() {
  const [formData, setFormData] = useState({
    lecturerId: "",
    classId: "",
  })

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Xử lý thêm phân công mới
    console.log("Submitted:", formData)
    // Sau khi thêm thành công, chuyển hướng về trang danh sách
    // router.push("/quan-ly-lop-hoc-phan/phan-cong")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/quan-ly-lop-hoc-phan/phan-cong">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Thêm phân công giảng viên</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin phân công</CardTitle>
          <CardDescription>Chọn giảng viên và lớp học để phân công</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lecturerId">Giảng viên</Label>
                <Select value={formData.lecturerId} onValueChange={(value) => handleSelectChange("lecturerId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giảng viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {lecturers.map((lecturer) => (
                      <SelectItem key={lecturer.id} value={lecturer.id.toString()}>
                        {lecturer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="classId">Lớp học</Label>
                <Select value={formData.classId} onValueChange={(value) => handleSelectChange("classId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lớp học" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id.toString()}>
                        {classItem.code} - {classItem.name} ({classItem.semester})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Link href="/quan-ly-lop-hoc-phan/phan-cong">
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
