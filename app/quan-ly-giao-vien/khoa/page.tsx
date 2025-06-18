"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function DepartmentsPage() {
	const [departments, setDepartments] = useState<any[]>([])
	const [search, setSearch] = useState("")
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [editDepartment, setEditDepartment] = useState<any|null>(null)
	const [editForm, setEditForm] = useState<any|null>(null)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		const fetchDepartments = async () => {
			setLoading(true)
			setError("")
			try {
				const res = await fetch("/api/departments")
				if (!res.ok) throw new Error("Lỗi tải danh sách khoa")
				const data = await res.json()
				setDepartments(data)
			} catch (err: any) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}
		fetchDepartments()
	}, [])

	const reloadDepartments = () => {
		setLoading(true)
		fetch("/api/departments").then(res => res.json()).then(setDepartments).finally(() => setLoading(false))
	}

	const filteredDepartments = departments.filter((department) =>
		department.fullName.toLowerCase().includes(search.toLowerCase()) ||
		department.abbreviation.toLowerCase().includes(search.toLowerCase())
	)

	const handleEdit = (department: any) => {
		setEditDepartment(department)
		setEditForm({ ...department })
	}
	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setEditForm((prev: any) => ({ ...prev, [name]: value }))
	}
	const handleEditSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		await fetch("/api/departments", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...editForm, id: editDepartment.id })
		})
		setSaving(false)
		setEditDepartment(null)
		setEditForm(null)
		reloadDepartments()
	}
	const handleDelete = async (department: any) => {
		if (confirm(`Bạn có chắc muốn xóa khoa "${department.fullName}"?`)) {
			await fetch("/api/departments", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: department.id })
			})
			reloadDepartments()
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Danh sách khoa</h1>
				<Link href="/quan-ly-giao-vien/khoa/them-moi">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Thêm khoa
					</Button>
				</Link>
			</div>

			<div className="flex items-center space-x-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input type="search" placeholder="Tìm kiếm khoa..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
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
								<TableHead>Tên đầy đủ</TableHead>
								<TableHead>Tên viết tắt</TableHead>
								<TableHead>Mô tả nhiệm vụ</TableHead>
								<TableHead className="text-right">Thao tác</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredDepartments.map((department) => (
								<TableRow key={department.id}>
									<TableCell className="font-medium">{department.fullName}</TableCell>
									<TableCell>{department.abbreviation}</TableCell>
									<TableCell className="max-w-md truncate">{department.description}</TableCell>
									<TableCell className="text-right">
										<Button variant="outline" size="sm" onClick={() => handleEdit(department)} className="ml-2">Sửa</Button>
										<Button variant="destructive" size="sm" onClick={() => handleDelete(department)} className="ml-2">Xóa</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			<Dialog open={!!editDepartment} onOpenChange={open => { if (!open) { setEditDepartment(null); setEditForm(null); } }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Sửa khoa</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleEditSubmit} className="space-y-4">
						<div>
							<Label>Tên đầy đủ</Label>
							<Input name="fullName" value={editForm?.fullName || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Tên viết tắt</Label>
							<Input name="abbreviation" value={editForm?.abbreviation || ''} onChange={handleEditChange} required />
						</div>
						<div>
							<Label>Mô tả nhiệm vụ</Label>
							<Input name="description" value={editForm?.description || ''} onChange={handleEditChange} required />
						</div>
						<div className="flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={() => { setEditDepartment(null); setEditForm(null); }}>Hủy</Button>
							<Button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
