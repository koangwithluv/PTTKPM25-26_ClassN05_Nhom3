"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AddDegreePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    abbreviation: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Xử lý thêm bằng cấp mới
    console.log("Submitted:", formData)
    // Sau khi thêm thành công, chuyển hướng về trang danh sách
    // router.push("/quan-ly-giao-vien/bang-cap")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/quan-ly-giao-vien/bang-cap">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Thêm bằng cấp mới</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin bằng cấp</CardTitle>
          <CardDescription>Nhập đầy đủ thông tin để tạo bằng cấp mới</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Tên đầy đủ</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Nhập tên đầy đủ của bằng cấp"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abbreviation">Tên viết tắt</Label>
                <Input
                  id="abbreviation"
                  name="abbreviation"
                  placeholder="Nhập tên viết tắt"
                  value={formData.abbreviation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Link href="/quan-ly-giao-vien/bang-cap">
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
