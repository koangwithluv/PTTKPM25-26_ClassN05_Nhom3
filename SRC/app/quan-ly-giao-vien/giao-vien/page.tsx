"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function TeachersPage() {
	const [teachers, setTeachers] = useState<any[]>([])
	const [departments, setDepartments] = useState<any[]>([])
	const [degrees, setDegrees] = useState<any[]>([])
	const [filterDepartment, setFilterDepartment] = useState<string>("all")
	const [search, setSearch] = useState("")
	const [editTeacher, setEditTeacher] = useState<any|null>(null)
	const [editForm, setEditForm] = useState<any|null>(null)
	const [saving, setSaving] = useState(false)
	const [deleteInfo, setDeleteInfo] = useState<any|null>(null);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		fetch("/api/teachers").then((res) => res.json()).then(setTeachers)
		fetch("/api/departments").then((res) => res.json()).then(setDepartments)
		fetch("/api/degrees").then((res) => res.json()).then(setDegrees)
	}, [])

	const getDepartmentName = (id: number) => departments.find((d: any) => d.id === id)?.fullName || id
	const getDegreeName = (id: number) => degrees.find((d: any) => d.id === id)?.fullName || id

	const filteredTeachers = teachers.filter((teacher) => {
		const matchDepartment = filterDepartment === "all" || String(teacher.departmentId) === filterDepartment
		const matchSearch =
			teacher.fullName.toLowerCase().includes(search.toLowerCase()) ||
			teacher.code.toLowerCase().includes(search.toLowerCase()) ||
			teacher.email.toLowerCase().includes(search.toLowerCase())
		return matchDepartment && matchSearch
	})

	const handleEdit = (teacher: any) => {
		setEditTeacher(teacher)
		setEditForm({ ...teacher })
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
		await fetch(`/api/teachers?id=${editTeacher.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(editForm)
		})
		setSaving(false)
		setEditTeacher(null)
		setEditForm(null)
		fetch("/api/teachers").then((res) => res.json()).then(setTeachers)
	}
	const handleDelete = async (teacher: any) => {
		setDeleting(true);
		// Lấy dữ liệu liên quan
		const res = await fetch(`/api/teachers/related?id=${teacher.id}`);
		const related = await res.json();
		setDeleteInfo({ teacher, related });
		setDeleting(false);
	}
	const confirmDelete = async () => {
		if (!deleteInfo) return;
		await fetch(`/api/teachers`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: deleteInfo.teacher.id })
		});
		setDeleteInfo(null);
		fetch("/api/teachers").then((res) => res.json()).then(setTeachers);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Danh sách giáo viên</h1>
				<Link href="/quan-ly-giao-vien/giao-vien/them-moi">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Thêm giáo viên
					</Button>
				</Link>
			</div>

			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
				<div className="relative flex-1 min-w-[200px]">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Tìm kiếm giáo viên..."
						className="pl-8"
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
				<Select value={filterDepartment} onValueChange={setFilterDepartment}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Chọn khoa" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tất cả khoa</SelectItem>
						{departments.map((department) => (
							<SelectItem key={department.id} value={String(department.id)}>
								{department.fullName || department.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Mã số</TableHead>
							<TableHead>Họ tên</TableHead>
							<TableHead>Ngày sinh</TableHead>
							<TableHead>Điện thoại</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Khoa</TableHead>
							<TableHead>Bằng cấp</TableHead>
							<TableHead className="text-right">Thao tác</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredTeachers.map((teacher) => (
							<TableRow key={teacher.id}>
								<TableCell className="font-medium">{teacher.code}</TableCell>
								<TableCell>{teacher.fullName}</TableCell>
								<TableCell>{teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString('vi-VN') : ''}</TableCell>
								<TableCell>{teacher.phone}</TableCell>
								<TableCell>{teacher.email}</TableCell>
								<TableCell>{getDepartmentName(teacher.departmentId)}</TableCell>
								<TableCell>{getDegreeName(teacher.degreeId)}</TableCell>
								<TableCell className="text-right">
									<Button variant="outline" size="sm" onClick={() => handleEdit(teacher)} className="ml-2">Sửa</Button>
									<Button variant="destructive" size="sm" onClick={() => handleDelete(teacher)} className="ml-2" disabled={deleting}>Xóa</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Dialog open={!!editTeacher} onOpenChange={open => { if (!open) { setEditTeacher(null); setEditForm(null); } }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Sửa thông tin giáo viên</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleEditSubmit} className="space-y-4">
						<div>
							<Label>Mã số</Label>
							<Input name="code" value={editForm?.code || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Họ tên</Label>
							<Input name="fullName" value={editForm?.fullName || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Ngày sinh</Label>
							<Input name="dateOfBirth" type="date" value={editForm?.dateOfBirth ? editForm.dateOfBirth.slice(0,10) : ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Điện thoại</Label>
							<Input name="phone" value={editForm?.phone || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Email</Label>
							<Input name="email" value={editForm?.email || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Khoa</Label>
							<Select value={editForm?.departmentId?.toString() || ''} onValueChange={v => handleEditSelect('departmentId', v)}>
								<SelectTrigger><SelectValue placeholder="Chọn khoa" /></SelectTrigger>
								<SelectContent>
									{departments.map((d: any) => <SelectItem key={d.id} value={d.id.toString()}>{d.fullName || d.name}</SelectItem>)}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Bằng cấp</Label>
							<Select value={editForm?.degreeId?.toString() || ''} onValueChange={v => handleEditSelect('degreeId', v)}>
								<SelectTrigger><SelectValue placeholder="Chọn bằng cấp" /></SelectTrigger>
								<SelectContent>
									{degrees.map((d: any) => <SelectItem key={d.id} value={d.id.toString()}>{d.fullName || d.name}</SelectItem>)}
								</SelectContent>
							</Select>
						</div>
						<div className="flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={() => { setEditTeacher(null); setEditForm(null); }}>Hủy</Button>
							<Button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={!!deleteInfo} onOpenChange={open => { if (!open) setDeleteInfo(null); }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Xác nhận xóa giáo viên</DialogTitle>
					</DialogHeader>
					{deleteInfo && (
						<div className="space-y-2">
							<p>Bạn có chắc muốn xóa giáo viên <b>{deleteInfo.teacher.fullName}</b>?</p>
							{deleteInfo.related?.assignments?.length > 0 && (
								<div className="text-sm text-red-600">
									<p>Các phân công liên quan sẽ bị xóa cùng:</p>
									<ul className="list-disc ml-5">
										{deleteInfo.related.assignments.map((asg: any) => (
											<li key={asg.id}>
												Mã phân công: <b>{asg.id}</b> - Mã lớp: <b>{asg.classId}</b>
											</li>
										))}
									</ul>
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