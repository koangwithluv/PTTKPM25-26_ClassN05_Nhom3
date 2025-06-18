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

export default function ClassesPage() {
	const [classes, setClasses] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [search, setSearch] = useState("")
	const [semesters, setSemesters] = useState<any[]>([])
	const [courses, setCourses] = useState<any[]>([])
	const [selectedSemester, setSelectedSemester] = useState("all")
	const [editClass, setEditClass] = useState<any|null>(null)
	const [editForm, setEditForm] = useState<any|null>(null)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			setError("")
			try {
				const [classesRes, semestersRes, coursesRes] = await Promise.all([
					fetch("/api/classes"),
					fetch("/api/semesters"),
					fetch("/api/coueses")
				])
				if (!classesRes.ok) throw new Error("Lỗi tải danh sách lớp học")
				if (!semestersRes.ok) throw new Error("Lỗi tải danh sách kì học")
				if (!coursesRes.ok) throw new Error("Lỗi tải danh sách học phần")
				const classesData = await classesRes.json()
				const semestersData = await semestersRes.json()
				const coursesData = await coursesRes.json()
				setClasses(classesData)
				setSemesters(semestersData)
				setCourses(coursesData)
			} catch (err: any) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [])

	const reloadClasses = () => {
		setLoading(true)
		Promise.all([
			fetch("/api/classes"),
			fetch("/api/semesters"),
			fetch("/api/coueses")
		]).then(async ([classesRes, semestersRes, coursesRes]) => {
			const classesData = await classesRes.json()
			const semestersData = await semestersRes.json()
			const coursesData = await coursesRes.json()
			setClasses(classesData)
			setSemesters(semestersData)
			setCourses(coursesData)
		}).finally(() => setLoading(false))
	}

	const filteredClasses = classes.filter((classItem) => {
		const matchSearch =
			classItem.name?.toLowerCase().includes(search.toLowerCase()) ||
			classItem.code?.toLowerCase().includes(search.toLowerCase())
		const matchSemester =
			selectedSemester === "all" || classItem.semesterId?.toString() === selectedSemester
		return matchSearch && matchSemester
	})

	const handleEdit = (classItem: any) => {
		setEditClass(classItem)
		setEditForm({ ...classItem })
	}
	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setEditForm((prev: any) => ({ ...prev, [name]: value }))
	}
	const handleEditSelect = (name: string, value: string) => {
		setEditForm((prev: any) => ({ ...prev, [name]: value }))
	}
	const handleEditSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		await fetch("/api/classes", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...editForm, id: editClass.id })
		})
		setSaving(false)
		setEditClass(null)
		setEditForm(null)
		reloadClasses()
	}
	const handleDelete = async (classItem: any) => {
		if (confirm(`Bạn có chắc muốn xóa lớp học "${classItem.name}"?`)) {
			await fetch("/api/classes", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: classItem.id })
			})
			reloadClasses()
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Danh sách lớp học</h1>
				<Link href="/quan-ly-lop-hoc-phan/lop-hoc/them-moi">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Thêm lớp học
					</Button>
				</Link>
			</div>

			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
				<div className="relative flex-1 min-w-[200px]">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input type="search" placeholder="Tìm kiếm lớp học..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
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
								<TableHead>Mã lớp</TableHead>
								<TableHead>Tên lớp</TableHead>
								<TableHead>Học phần</TableHead>
								<TableHead>Kì học</TableHead>
								<TableHead className="text-center">Số SV</TableHead>
								<TableHead className="text-right">Thao tác</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredClasses.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center">Không có lớp học nào</TableCell>
								</TableRow>
							) : (
								filteredClasses.map((classItem) => (
									<TableRow key={classItem.id}>
										<TableCell className="font-medium">{classItem.code}</TableCell>
										<TableCell>{classItem.name}</TableCell>
										<TableCell>{courses.find((c: any) => c.id === classItem.courseId)?.name || classItem.courseCode || classItem.course}</TableCell>
										<TableCell>{semesters.find((s: any) => s.id === classItem.semesterId)?.name || classItem.semester}</TableCell>
										<TableCell className="text-center">{classItem.students}</TableCell>
										<TableCell className="text-right">
											<Button variant="outline" size="sm" onClick={() => handleEdit(classItem)} className="ml-2">Sửa</Button>
											<Button variant="destructive" size="sm" onClick={() => handleDelete(classItem)} className="ml-2">Xóa</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			)}

			<Dialog open={!!editClass} onOpenChange={open => { if (!open) { setEditClass(null); setEditForm(null); } }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Sửa lớp học</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleEditSubmit} className="space-y-4">
						<div>
							<Label>Mã lớp</Label>
							<Input name="code" value={editForm?.code || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Tên lớp</Label>
							<Input name="name" value={editForm?.name || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Học phần</Label>
							<Select value={editForm?.courseId?.toString() || ''} onValueChange={v => handleEditSelect('courseId', v)}>
								<SelectTrigger><SelectValue placeholder="Chọn học phần" /></SelectTrigger>
								<SelectContent>
									{courses.map((c: any) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Kì học</Label>
							<Select value={editForm?.semesterId?.toString() || ''} onValueChange={v => handleEditSelect('semesterId', v)}>
								<SelectTrigger><SelectValue placeholder="Chọn kì học" /></SelectTrigger>
								<SelectContent>
									{semesters.map((s: any) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Số SV</Label>
							<Input name="students" type="number" value={editForm?.students || ''} onChange={handleEditChange} required min={1} />
						</div>
						<div className="flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={() => { setEditClass(null); setEditForm(null); }}>Hủy</Button>
							<Button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
