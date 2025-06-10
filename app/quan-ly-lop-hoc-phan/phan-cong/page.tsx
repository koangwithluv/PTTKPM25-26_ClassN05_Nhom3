"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Dữ liệu mẫu cho phân công giảng viên
const assignments = [
  { id: 1, lecturer: "Nguyễn Văn A", class: "IT001.1", course: "Nhập môn lập trình", semester: "HK1 2023-2024" },
  { id: 2, lecturer: "Trần Thị B", class: "IT001.2", course: "Nhập môn lập trình", semester: "HK1 2023-2024" },
  { id: 3, lecturer: "Lê Văn C", class: "IT002.1", course: "Lập trình hướng đối tượng", semester: "HK1 2023-2024" },
  {
    id: 4,
    lecturer: "Phạm Thị D",
    class: "IT003.1",
    course: "Cấu trúc dữ liệu và giải thuật",
    semester: "HK2 2023-2024",
  },
  { id: 5, lecturer: "Hoàng Văn E", class: "IT004.1", course: "Cơ sở dữ liệu", semester: "HK2 2023-2024" },
]

// Dữ liệu mẫu cho kì học
const semesters = [
  { id: 1, name: "HK1 2023-2024" },
  { id: 2, name: "HK2 2023-2024" },
  { id: 3, name: "HK hè 2023-2024" },
]

export default function AssignmentsPage() {
  const [search, setSearch] = useState("")
  const filteredAssignments = assignments.filter((assignment) =>
    assignment.lecturer.toLowerCase().includes(search.toLowerCase()) ||
    assignment.class.toLowerCase().includes(search.toLowerCase()) ||
    assignment.course.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Phân công giảng viên</h1>
        <Link href="/quan-ly-lop-hoc-phan/phan-cong/them-moi">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm phân công
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Tìm kiếm giảng viên..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn kì học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả kì học</SelectItem>
            {semesters.map((semester) => (
              <SelectItem key={semester.id} value={semester.id.toString()}>
                {semester.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Giảng viên</TableHead>
              <TableHead>Mã lớp</TableHead>
              <TableHead>Học phần</TableHead>
              <TableHead>Kì học</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">{assignment.lecturer}</TableCell>
                <TableCell>{assignment.class}</TableCell>
                <TableCell>{assignment.course}</TableCell>
                <TableCell>{assignment.semester}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/quan-ly-lop-hoc-phan/phan-cong/${assignment.id}`}>
                    <Button variant="ghost" size="sm">
                      Chi tiết
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
