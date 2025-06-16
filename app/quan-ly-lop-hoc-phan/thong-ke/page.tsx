"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Download } from "lucide-react"
import { useEffect, useState } from "react"

export default function StatisticsPage() {
  const [academicYears, setAcademicYears] = useState<any[]>([])
  const [selectedYear, setSelectedYear] = useState("")
  const [statisticsData, setStatisticsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")
      try {
        // Giả sử có API /api/statistics và /api/academic-years
        const [yearsRes, statsRes] = await Promise.all([
          fetch("/api/academic-years"),
          fetch(`/api/statistics${selectedYear ? `?year=${selectedYear}` : ""}`)
        ])
        if (!yearsRes.ok) throw new Error("Lỗi tải năm học")
        if (!statsRes.ok) throw new Error("Lỗi tải thống kê")
        const yearsData = await yearsRes.json()
        const statsData = await statsRes.json()
        setAcademicYears(yearsData)
        setStatisticsData(statsData)
        if (!selectedYear && yearsData.length > 0) setSelectedYear(yearsData[0].id.toString())
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear])

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
                {academicYears.map((year: any) => (
                  <SelectItem key={year.id} value={year.id.toString()}>
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã học phần</TableHead>
                    <TableHead>Tên học phần</TableHead>
                    <TableHead className="text-center">Học kì 1</TableHead>
                    <TableHead className="text-center">Học kì 2</TableHead>
                    <TableHead className="text-center">Học kì hè</TableHead>
                    <TableHead className="text-center">Tổng cộng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statisticsData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Không có dữ liệu</TableCell>
                    </TableRow>
                  ) : (
                    statisticsData.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.course}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center">{item.semester1}</TableCell>
                        <TableCell className="text-center">{item.semester2}</TableCell>
                        <TableCell className="text-center">{item.summer}</TableCell>
                        <TableCell className="text-center">{item.total}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
