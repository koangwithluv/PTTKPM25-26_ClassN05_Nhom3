"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Download } from "lucide-react"
import { useState } from "react"

// Dữ liệu mẫu cho năm học
const academicYears = [
  { id: 1, name: "2023-2024" },
  { id: 2, name: "2022-2023" },
  { id: 3, name: "2021-2022" },
]

// Dữ liệu mẫu cho thống kê
const statisticsData = [
  { id: 1, course: "IT001", name: "Nhập môn lập trình", semester1: 2, semester2: 1, summer: 0, total: 3 },
  { id: 2, course: "IT002", name: "Lập trình hướng đối tượng", semester1: 1, semester2: 2, summer: 1, total: 4 },
  { id: 3, course: "IT003", name: "Cấu trúc dữ liệu và giải thuật", semester1: 1, semester2: 1, summer: 0, total: 2 },
  { id: 4, course: "IT004", name: "Cơ sở dữ liệu", semester1: 1, semester2: 1, summer: 1, total: 3 },
  { id: 5, course: "IT005", name: "Mạng máy tính", semester1: 0, semester2: 2, summer: 0, total: 2 },
]

export default function StatisticsPage() {
  const [selectedYear, setSelectedYear] = useState("1")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Thống kê số lớp mở</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Thống kê theo năm học
          </CardTitle>
          <CardDescription>Số lượng lớp mở cho các học phần trong từng kì học</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn năm học" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year.id} value={year.id.toString()}>
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã học phần</TableHead>
                  <TableHead>Tên học phần</TableHead>
                  <TableHead className="text-center">Học kỳ 1</TableHead>
                  <TableHead className="text-center">Học kỳ 2</TableHead>
                  <TableHead className="text-center">Học kỳ hè</TableHead>
                  <TableHead className="text-center">Tổng cộng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statisticsData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.course}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-center">{item.semester1}</TableCell>
                    <TableCell className="text-center">{item.semester2}</TableCell>
                    <TableCell className="text-center">{item.summer}</TableCell>
                    <TableCell className="text-center font-medium">{item.total}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="font-bold">
                    Tổng cộng
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {statisticsData.reduce((sum, item) => sum + item.semester1, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {statisticsData.reduce((sum, item) => sum + item.semester2, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {statisticsData.reduce((sum, item) => sum + item.summer, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {statisticsData.reduce((sum, item) => sum + item.total, 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
