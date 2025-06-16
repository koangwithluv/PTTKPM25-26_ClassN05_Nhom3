"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [semesters, setSemesters] = useState<any[]>([])
  const [selectedSemester, setSelectedSemester] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")
      try {
        const [assignmentsRes, semestersRes] = await Promise.all([
          fetch("/api/assignments"),
          fetch("/api/semesters"),
        ])
        if (!assignmentsRes.ok) throw new Error("Lỗi tải danh sách phân công")
        if (!semestersRes.ok) throw new Error("Lỗi tải danh sách kì học")
        const assignmentsData = await assignmentsRes.json()
        const semestersData = await semestersRes.json()
        setAssignments(assignmentsData)
        setSemesters(semestersData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredAssignments = assignments.filter((assignment) => {
    const matchSearch =
      assignment.lecturerName?.toLowerCase().includes(search.toLowerCase()) ||
      assignment.classCode?.toLowerCase().includes(search.toLowerCase()) ||
      assignment.courseName?.toLowerCase().includes(search.toLowerCase())
    const matchSemester =
      selectedSemester === "all" || assignment.semesterId?.toString() === selectedSemester
    return matchSearch && matchSemester
  })

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
          <Input
            type="search"
            placeholder="Tìm kiếm giảng viên..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn kì học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả kì học</SelectItem>
            {semesters.map((semester: any) => (
              <SelectItem key={semester.id} value={semester.id.toString()}>
                {semester.name}
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
                <TableHead>Giảng viên</TableHead>
                <TableHead>Mã lớp</TableHead>
                <TableHead>Học phần</TableHead>
                <TableHead>Kì học</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Không có phân công nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.lecturerName}</TableCell>
                    <TableCell>{assignment.classCode}</TableCell>
                    <TableCell>{assignment.courseName}</TableCell>
                    <TableCell>
                      {semesters.find((s: any) => s.id === assignment.semesterId)?.name || ""}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/quan-ly-lop-hoc-phan/phan-cong/${assignment.id}`}>
                        <Button variant="ghost" size="sm">
                          Chi tiết
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
