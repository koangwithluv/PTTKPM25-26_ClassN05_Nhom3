"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [semesters, setSemesters] = useState<any[]>([])
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [teachers, setTeachers] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [editAssignment, setEditAssignment] = useState<any | null>(null)
  const [editForm, setEditForm] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteAssignment, setDeleteAssignment] = useState<any | null>(null)
  const [relatedData, setRelatedData] = useState<any | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")
      try {
        const [assignmentsRes, semestersRes, teachersRes, classesRes] = await Promise.all([
          fetch("/api/assignments"),
          fetch("/api/semesters"),
          fetch("/api/teachers"),
          fetch("/api/classes"),
        ])
        if (!assignmentsRes.ok) throw new Error("Lỗi tải danh sách phân công")
        if (!semestersRes.ok) throw new Error("Lỗi tải danh sách kì học")
        if (!teachersRes.ok) throw new Error("Lỗi tải danh sách giáo viên")
        if (!classesRes.ok) throw new Error("Lỗi tải danh sách lớp học")
        const assignmentsData = await assignmentsRes.json()
        const semestersData = await semestersRes.json()
        const teachersData = await teachersRes.json()
        const classesData = await classesRes.json()
        setAssignments(assignmentsData)
        setSemesters(semestersData)
        setTeachers(teachersData)
        setClasses(classesData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const reloadAssignments = () => {
    setLoading(true)
    Promise.all([
      fetch("/api/assignments"),
      fetch("/api/semesters"),
      fetch("/api/teachers"),
      fetch("/api/classes"),
    ])
      .then(async ([assignmentsRes, semestersRes, teachersRes, classesRes]) => {
        const assignmentsData = await assignmentsRes.json()
        const semestersData = await semestersRes.json()
        const teachersData = await teachersRes.json()
        const classesData = await classesRes.json()
        setAssignments(assignmentsData)
        setSemesters(semestersData)
        setTeachers(teachersData)
        setClasses(classesData)
      })
      .finally(() => setLoading(false))
  }

  const filteredAssignments = assignments.filter((assignment) => {
    const matchSearch =
      assignment.lecturerName?.toLowerCase().includes(search.toLowerCase()) ||
      assignment.classCode?.toLowerCase().includes(search.toLowerCase()) ||
      assignment.courseName?.toLowerCase().includes(search.toLowerCase())
    const matchSemester =
      selectedSemester === "all" || assignment.semesterId?.toString() === selectedSemester
    return matchSearch && matchSemester
  })

  const handleEdit = (assignment: any) => {
    setEditAssignment(assignment)
    setEditForm({ lecturerId: assignment.lecturerId, classId: assignment.classId })
  }
  const handleEditSelect = (name: string, value: string) => {
    setEditForm((prev: any) => ({ ...prev, [name]: value }))
  }
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch("/api/assignments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, id: editAssignment.id }),
    })
    setSaving(false)
    setEditAssignment(null)
    setEditForm(null)
    reloadAssignments()
  }
  const handleDelete = async (assignment: any) => {
    setDeleteAssignment(assignment)
    setRelatedData(null)
    // Lấy dữ liệu liên quan
    try {
      const res = await fetch(`/api/assignments/related?id=${assignment.id}`)
      if (res.ok) {
        const data = await res.json()
        setRelatedData(data)
      } else {
        setRelatedData({ error: "Không lấy được dữ liệu liên quan." })
      }
    } catch {
      setRelatedData({ error: "Không lấy được dữ liệu liên quan." })
    }
  }
  const confirmDelete = async () => {
    if (!deleteAssignment) return
    setDeleting(true)
    await fetch("/api/assignments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteAssignment.id }),
    })
    setDeleting(false)
    setDeleteAssignment(null)
    setRelatedData(null)
    reloadAssignments()
  }

  const handleCloseDialog = () => {
    setEditAssignment(null)
    setEditForm(null)
    setDeleteAssignment(null)
    setRelatedData(null)
  }

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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(assignment)}
                        className="ml-2"
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(assignment)}
                        className="ml-2"
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!editAssignment} onOpenChange={(open) => { if (!open) handleCloseDialog() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa phân công</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label>Giảng viên</Label>
              <Select
                value={editForm?.lecturerId?.toString() || ""}
                onValueChange={(v) => handleEditSelect("lecturerId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giảng viên" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t: any) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lớp học</Label>
              <Select
                value={editForm?.classId?.toString() || ""}
                onValueChange={(v) => handleEditSelect("classId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp học" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c: any) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditAssignment(null)
                  setEditForm(null)
                }}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteAssignment} onOpenChange={open => { if (!open) { setDeleteAssignment(null); setRelatedData(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa phân công</DialogTitle>
          </DialogHeader>
          {deleteAssignment && (
            <div className="space-y-2">
              <div>
                Bạn có chắc muốn xóa phân công của giảng viên{" "}
                <b>"{deleteAssignment.lecturerName}"</b> cho lớp <b>"{deleteAssignment.classCode}"</b>?
              </div>
              {relatedData === null && <div>Đang kiểm tra dữ liệu liên quan...</div>}
              {relatedData?.error && <div className="text-red-600">{relatedData.error}</div>}
              {relatedData && !relatedData.error && (
                <div className="text-sm text-gray-700 space-y-1">
                  {relatedData.assignment && (
                    <div>
                      <b>Thông tin phân công:</b>
                      <ul className="list-disc ml-5">
                        <li>Giảng viên: {relatedData.teacher?.fullName || deleteAssignment.lecturerName}</li>
                        <li>
                          Lớp: {relatedData.class?.code} - {relatedData.class?.name}
                        </li>
                      </ul>
                    </div>
                  )}
                  {!relatedData.assignment && <div>Không có dữ liệu liên quan.</div>}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDeleteAssignment(null)
                    setRelatedData(null)
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deleting || relatedData === null}
                  onClick={confirmDelete}
                >
                  {deleting ? "Đang xóa..." : "Xác nhận xóa"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
