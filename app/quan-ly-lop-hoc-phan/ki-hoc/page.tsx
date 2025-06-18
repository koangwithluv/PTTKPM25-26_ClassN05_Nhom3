"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function SemestersPage() {
	const [semesters, setSemesters] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [search, setSearch] = useState("")
	const [editSemester, setEditSemester] = useState<any|null>(null)
	const [editForm, setEditForm] = useState<any|null>(null)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		const fetchSemesters = async () => {
			setLoading(true)
			setError("")
			try {
				const res = await fetch("/api/semesters")
				if (!res.ok) throw new Error("Lỗi tải danh sách kì học")
				const data = await res.json()
				setSemesters(data)
			} catch (err: any) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}
		fetchSemesters()
	}, [])

	const reloadSemesters = () => {
		setLoading(true)
		fetch("/api/semesters").then(res => res.json()).then(setSemesters).finally(() => setLoading(false))
	}

	const filteredSemesters = semesters.filter((semester) =>
		semester.name.toLowerCase().includes(search.toLowerCase()) ||
		semester.academicYear.toLowerCase().includes(search.toLowerCase())
	)

	const handleEdit = (semester: any) => {
		setEditSemester(semester)
		setEditForm({ ...semester })
	}
	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setEditForm((prev: any) => ({ ...prev, [name]: value }))
	}
	const handleEditSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		await fetch("/api/semesters", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...editForm, id: editSemester.id })
		})
		setSaving(false)
		setEditSemester(null)
		setEditForm(null)
		reloadSemesters()
	}
	const handleDelete = async (semester: any) => {
		if (confirm(`Bạn có chắc muốn xóa kì học "${semester.name}"?`)) {
			await fetch("/api/semesters", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: semester.id })
			})
			reloadSemesters()
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Danh sách kì học</h1>
				<Link href="/quan-ly-lop-hoc-phan/ki-hoc/them-moi">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Thêm kì học
					</Button>
				</Link>
			</div>

			<div className="flex items-center space-x-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input type="search" placeholder="Tìm kiếm kì học..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
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
								<TableHead>Tên kì học</TableHead>
								<TableHead>Năm học</TableHead>
								<TableHead>Ngày bắt đầu</TableHead>
								<TableHead>Ngày kết thúc</TableHead>
								<TableHead className="text-right">Thao tác</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredSemesters.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center">Không có kì học nào</TableCell>
								</TableRow>
							) : (
								filteredSemesters.map((semester) => (
									<TableRow key={semester.id}>
										<TableCell className="font-medium">{semester.name}</TableCell>
										<TableCell>{semester.academicYear}</TableCell>
										<TableCell>{semester.startDate ? new Date(semester.startDate).toISOString().slice(0,10) : ''}</TableCell>
										<TableCell>{semester.endDate ? new Date(semester.endDate).toISOString().slice(0,10) : ''}</TableCell>
										<TableCell className="text-right">
											<Button variant="outline" size="sm" onClick={() => handleEdit(semester)} className="ml-2">Sửa</Button>
											<Button variant="destructive" size="sm" onClick={() => handleDelete(semester)} className="ml-2">Xóa</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			)}

			<Dialog open={!!editSemester} onOpenChange={open => { if (!open) { setEditSemester(null); setEditForm(null); } }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Sửa kì học</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleEditSubmit} className="space-y-4">
						<div>
							<Label>Tên kì học</Label>
							<Input name="name" value={editForm?.name || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Năm học</Label>
							<Input name="academicYear" value={editForm?.academicYear || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Ngày bắt đầu</Label>
							<Input name="startDate" type="date" value={editForm?.startDate ? editForm.startDate.slice(0,10) : ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Ngày kết thúc</Label>
							<Input name="endDate" type="date" value={editForm?.endDate ? editForm.endDate.slice(0,10) : ''} onChange={handleEditChange} required />
						</div>
						<div className="flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={() => { setEditSemester(null); setEditForm(null); }}>Hủy</Button>
							<Button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
