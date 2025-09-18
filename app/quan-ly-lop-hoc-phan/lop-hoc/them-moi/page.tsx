"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddClassPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    courseId: "",
    semesterId: "",
    students: "",
  })
  const [courses, setCourses] = useState<any[]>([])
  const [semesters, setSemesters] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, semestersRes] = await Promise.all([
          fetch("/api/coueses"),
          fetch("/api/semesters"),
        ])
        if (!coursesRes.ok) throw new Error("Lỗi tải học phần")
        if (!semestersRes.ok) throw new Error("Lỗi tải kì học")
        setCourses(await coursesRes.json())
        setSemesters(await semestersRes.json())
      } catch (err: any) {
        setError(err.message)
      }
    }
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.code,
          name: formData.name,
          courseId: Number(formData.courseId),
          semesterId: Number(formData.semesterId),
          students: Number(formData.students),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Lỗi không xác định")
      router.push("/quan-ly-lop-hoc-phan/lop-hoc")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
                  placeholder="Nhập tên lớp"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseId">Học phần</Label>
                <Select value={formData.courseId} onValueChange={(v) => handleSelectChange("courseId", v)} required>
                  <SelectTrigger id="courseId">
                    <SelectValue placeholder="Chọn học phần" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course: any) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semesterId">Kì học</Label>
                <Select value={formData.semesterId} onValueChange={(v) => handleSelectChange("semesterId", v)} required>
                  <SelectTrigger id="semesterId">
                    <SelectValue placeholder="Chọn kì học" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester: any) => (
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
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex justify-end space-x-2">
              <Link href="/quan-ly-lop-hoc-phan/lop-hoc">
                <Button variant="outline">Hủy</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
