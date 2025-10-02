"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddAssignmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    lecturerId: "",
    classId: "",
  })
  const [lecturers, setLecturers] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lecturersRes, classesRes] = await Promise.all([
          fetch("/api/teachers"),
          fetch("/api/classes"),
        ])
        if (!lecturersRes.ok) throw new Error("Lỗi tải giảng viên")
        if (!classesRes.ok) throw new Error("Lỗi tải lớp học")
        setLecturers(await lecturersRes.json())
        setClasses(await classesRes.json())
      } catch (err: any) {
        setError(err.message)
      }
    }
    fetchData()
  }, [])

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lecturerId: Number(formData.lecturerId),
          classId: Number(formData.classId),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Lỗi không xác định")
      router.push("/quan-ly-lop-hoc-phan/phan-cong")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
                <Select
                  value={formData.lecturerId}
                  onValueChange={(value) => handleSelectChange("lecturerId", value)}
                  required
                >
                  <SelectTrigger id="lecturerId">
                    <SelectValue placeholder="Chọn giảng viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {lecturers.map((lecturer: any) => (
                      <SelectItem key={lecturer.id} value={lecturer.id.toString()}>
                        {lecturer.fullName || lecturer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="classId">Lớp học</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => handleSelectChange("classId", value)}
                  required
                >
                  <SelectTrigger id="classId">
                    <SelectValue placeholder="Chọn lớp học" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem: any) => (
                      <SelectItem key={classItem.id} value={classItem.id.toString()}>
                        {classItem.code} - {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex justify-end space-x-2">
              <Link href="/quan-ly-lop-hoc-phan/phan-cong">
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
