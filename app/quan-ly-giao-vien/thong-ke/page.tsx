"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Download, GraduationCap, Building2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function TeacherStatisticsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [teachers, setTeachers] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [degrees, setDegrees] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/teachers").then(res => res.json()).then(setTeachers)
    fetch("/api/departments").then(res => res.json()).then(setDepartments)
    fetch("/api/degrees").then(res => res.json()).then(setDegrees)
  }, [])

  // Tính toán thống kê động
  const totalTeachers = teachers.length
  const normalize = (str: string) => str?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '') || ''
  const phdDegreeIds = degrees.filter(d => normalize(d.fullName).includes("tien si") || normalize(d.abbreviation).includes("ts") || normalize(d.fullName).includes("phd")).map(d => d.id)
  const masterDegreeIds = degrees.filter(d => normalize(d.fullName).includes("thac si") || normalize(d.abbreviation).includes("ths") || normalize(d.fullName).includes("msc")).map(d => d.id)
  const bachelorDegreeIds = degrees.filter(d => normalize(d.fullName).includes("cu nhan") || normalize(d.fullName).includes("ky su") || normalize(d.abbreviation).includes("dh") || normalize(d.fullName).includes("bachelor") || normalize(d.fullName).includes("engineer")).map(d => d.id)

  const departmentStats = departments.map((dep) => {
    const teachersInDep = teachers.filter(t => t.departmentId === dep.id)
    return {
      id: dep.id,
      department: dep.abbreviation || dep.name,
      totalTeachers: teachersInDep.length,
      phd: teachersInDep.filter(t => phdDegreeIds.includes(t.degreeId)).length,
      master: teachersInDep.filter(t => masterDegreeIds.includes(t.degreeId)).length,
      bachelor: teachersInDep.filter(t => bachelorDegreeIds.includes(t.degreeId)).length,
    }
  })

  const phdCount = teachers.filter(t => phdDegreeIds.includes(t.degreeId)).length
  const masterCount = teachers.filter(t => masterDegreeIds.includes(t.degreeId)).length
  const bachelorCount = teachers.filter(t => bachelorDegreeIds.includes(t.degreeId)).length
  const degreeStats = [
    { id: 1, degree: "Tiến sĩ", count: phdCount, percentage: totalTeachers ? Math.round((phdCount/totalTeachers)*100) : 0 },
    { id: 2, degree: "Thạc sĩ", count: masterCount, percentage: totalTeachers ? Math.round((masterCount/totalTeachers)*100) : 0 },
    { id: 3, degree: "Cử nhân/Kỹ sư", count: bachelorCount, percentage: totalTeachers ? Math.round((bachelorCount/totalTeachers)*100) : 0 },
  ]

  // Thống kê theo bằng cấp thực tế
  const degreeRealStats = degrees.map((deg) => {
    const count = teachers.filter(t => t.degreeId === deg.id).length;
    return {
      id: deg.id,
      degree: deg.fullName + (deg.abbreviation ? ` (${deg.abbreviation})` : ""),
      count,
      percentage: totalTeachers ? Math.round((count/totalTeachers)*100) : 0
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Thống kê giáo viên</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số giáo viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Trên toàn trường</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số khoa</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ Tiến sĩ</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{degreeStats[0].percentage}%</div>
            <p className="text-xs text-muted-foreground">Trong tổng số giáo viên</p>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê theo khoa */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê theo khoa</CardTitle>
          <CardDescription>Phân bố giáo viên theo khoa và trình độ học vấn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Chọn khoa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khoa</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id.toString()}>
                    {department.abbreviation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khoa</TableHead>
                  <TableHead className="text-center">Tổng số GV</TableHead>
                  <TableHead className="text-center">Tiến sĩ</TableHead>
                  <TableHead className="text-center">Thạc sĩ</TableHead>
                  <TableHead className="text-center">Cử nhân/Kỹ sư</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentStats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell className="font-medium">{stat.department}</TableCell>
                    <TableCell className="text-center">{stat.totalTeachers}</TableCell>
                    <TableCell className="text-center">{stat.phd}</TableCell>
                    <TableCell className="text-center">{stat.master}</TableCell>
                    <TableCell className="text-center">{stat.bachelor}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-bold">Tổng cộng</TableCell>
                  <TableCell className="text-center font-bold">
                    {departmentStats.reduce((sum, stat) => sum + stat.totalTeachers, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {departmentStats.reduce((sum, stat) => sum + stat.phd, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {departmentStats.reduce((sum, stat) => sum + stat.master, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {departmentStats.reduce((sum, stat) => sum + stat.bachelor, 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Thống kê theo bằng cấp */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê theo bằng cấp</CardTitle>
          <CardDescription>Phân bố giáo viên theo trình độ học vấn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bằng cấp</TableHead>
                  <TableHead className="text-center">Số lượng</TableHead>
                  <TableHead className="text-center">Tỷ lệ (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {degreeRealStats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell className="font-medium">{stat.degree}</TableCell>
                    <TableCell className="text-center">{stat.count}</TableCell>
                    <TableCell className="text-center">{stat.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
