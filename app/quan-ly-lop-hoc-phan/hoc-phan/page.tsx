"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function CoursesPage() {
	const [courses, setCourses] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [search, setSearch] = useState("")
	const [editCourse, setEditCourse] = useState<any|null>(null)
	const [editForm, setEditForm] = useState<any|null>(null)
	const [saving, setSaving] = useState(false)
	const [deleteInfo, setDeleteInfo] = useState<any|null>(null);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		const fetchCourses = async () => {
			setLoading(true)
			setError("")
			try {
				const resCourses = await fetch("/api/coueses")
				if (!resCourses.ok) throw new Error("Lỗi tải danh sách học phần")
				const dataCourses = await resCourses.json()
				setCourses(dataCourses)
			} catch (err: any) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}
		fetchCourses()
	}, [])

	const reloadCourses = () => {
		setLoading(true)
		fetch("/api/coueses").then(res => res.json()).then(setCourses).finally(() => setLoading(false))
	}

	const filteredCourses = courses.filter((course) =>
		course.name.toLowerCase().includes(search.toLowerCase()) ||
		course.code.toLowerCase().includes(search.toLowerCase())
	)

	const handleEdit = (course: any) => {
		setEditCourse(course)
		setEditForm({ ...course })
	}
	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setEditForm((prev: any) => ({ ...prev, [name]: value }))
	}
	const handleEditSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		await fetch("/api/coueses", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...editForm, id: editCourse.id })
		})
		setSaving(false)
		setEditCourse(null)
		setEditForm(null)
		reloadCourses()
	}
	const handleDelete = async (course: any) => {
		setDeleting(true);
		// Lấy dữ liệu liên quan
		const res = await fetch(`/api/coueses/related?id=${course.id}`);
		const related = await res.json();
		setDeleteInfo({ course, related });
		setDeleting(false);
	}
	const confirmDelete = async () => {
		if (!deleteInfo) return;
		await fetch("/api/coueses", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: deleteInfo.course.id })
		});
		setDeleteInfo(null);
		reloadCourses();
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Danh sách học phần</h1>
				<Link href="/quan-ly-lop-hoc-phan/hoc-phan/them-moi">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Thêm học phần
					</Button>
				</Link>
			</div>

			<div className="flex items-center space-x-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input type="search" placeholder="Tìm kiếm học phần..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
				</div>
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
								<TableHead className="text-center">Số tín chỉ</TableHead>
								<TableHead className="text-center">Hệ số</TableHead>
								<TableHead className="text-center">Số tiết</TableHead>
								<TableHead className="text-right">Thao tác</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredCourses.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center">Không có học phần nào</TableCell>
								</TableRow>
							) : (
								filteredCourses.map((course) => (
									<TableRow key={course.id}>
										<TableCell className="font-medium">{course.code}</TableCell>
										<TableCell>{course.name}</TableCell>
										<TableCell className="text-center">{course.credits}</TableCell>
										<TableCell className="text-center">{course.coefficient}</TableCell>
										<TableCell className="text-center">{course.periods}</TableCell>
										<TableCell className="text-right">
											<Button variant="outline" size="sm" onClick={() => handleEdit(course)} className="ml-2">Sửa</Button>
											<Button variant="destructive" size="sm" onClick={() => handleDelete(course)} className="ml-2" disabled={deleting}>Xóa</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			)}

			<Dialog open={!!editCourse} onOpenChange={open => { if (!open) { setEditCourse(null); setEditForm(null); } }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Sửa học phần</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleEditSubmit} className="space-y-4">
						<div>
							<Label>Mã học phần</Label>
							<Input name="code" value={editForm?.code || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Tên học phần</Label>
							<Input name="name" value={editForm?.name || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Số tín chỉ</Label>
							<Input name="credits" type="number" value={editForm?.credits || ''} onChange={handleEditChange} required min={1} />
						</div>
						<div>
							<Label>Hệ số</Label>
							<Input name="coefficient" type="number" step="0.01" value={editForm?.coefficient || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Số tiết</Label>
							<Input name="periods" type="number" value={editForm?.periods || ''} onChange={handleEditChange} required min={1} />
						</div>
						<div className="flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={() => { setEditCourse(null); setEditForm(null); }}>Hủy</Button>
							<Button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			{/* Dialog xác nhận xóa và hiển thị dữ liệu liên quan */}
			<Dialog open={!!deleteInfo} onOpenChange={open => { if (!open) setDeleteInfo(null); }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Xác nhận xóa học phần</DialogTitle>
					</DialogHeader>
					{deleteInfo && (
						<div className="space-y-2">
							<p>Bạn có chắc muốn xóa học phần <b>{deleteInfo.course.name}</b>?</p>
							{(deleteInfo.related?.classes?.length > 0 || deleteInfo.related?.assignments?.length > 0) && (
								<div className="text-sm text-red-600">
									<p>Các dữ liệu liên quan sẽ bị xóa cùng:</p>
									{deleteInfo.related.classes.length > 0 && (
										<div>
											<b>Lớp học:</b>
											<ul className="list-disc ml-5">
												{deleteInfo.related.classes.map((cls: any) => (
													<li key={cls.id}>
														Mã lớp: <b>{cls.code}</b> - Tên lớp: <b>{cls.name}</b>
													</li>
												))}
											</ul>
										</div>
									)}
									{deleteInfo.related.assignments.length > 0 && (
										<div>
											<b>Phân công giảng viên:</b>
											<ul className="list-disc ml-5">
												{deleteInfo.related.assignments.map((asg: any) => (
													<li key={asg.id}>
														Mã lớp: <b>{asg.classId}</b> - Mã phân công: <b>{asg.id}</b>
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							)}
							<div className="flex justify-end gap-2 pt-2">
								<Button type="button" variant="outline" onClick={() => setDeleteInfo(null)}>Hủy</Button>
								<Button type="button" variant="destructive" onClick={confirmDelete}>Xóa</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
