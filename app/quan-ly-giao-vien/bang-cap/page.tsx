"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function DegreesPage() {
	const [degrees, setDegrees] = useState<any[]>([])
	const [search, setSearch] = useState("")
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [editDegree, setEditDegree] = useState<any|null>(null)
	const [editForm, setEditForm] = useState<any|null>(null)
	const [saving, setSaving] = useState(false)
	const [deleteInfo, setDeleteInfo] = useState<any|null>(null);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		const fetchDegrees = async () => {
			setLoading(true)
			setError("")
			try {
				const res = await fetch("/api/degrees")
				if (!res.ok) throw new Error("Lỗi tải danh sách bằng cấp")
				const data = await res.json()
				setDegrees(data)
			} catch (err: any) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}
		fetchDegrees()
	}, [])

	const reloadDegrees = () => {
		setLoading(true)
		fetch("/api/degrees").then(res => res.json()).then(setDegrees).finally(() => setLoading(false))
	}

	const filteredDegrees = degrees.filter((degree) =>
		degree.fullName.toLowerCase().includes(search.toLowerCase()) ||
		degree.abbreviation.toLowerCase().includes(search.toLowerCase())
	)

	const handleEdit = (degree: any) => {
		setEditDegree(degree)
		setEditForm({ ...degree })
	}
	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setEditForm((prev: any) => ({ ...prev, [name]: value }))
	}
	const handleEditSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		await fetch("/api/degrees", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...editForm, id: editDegree.id })
		})
		setSaving(false)
		setEditDegree(null)
		setEditForm(null)
		reloadDegrees()
	}
	const handleDelete = async (degree: any) => {
		setDeleting(true);
		// Lấy dữ liệu liên quan
		const res = await fetch(`/api/degrees/related?id=${degree.id}`);
		const related = await res.json();
		setDeleteInfo({ degree, related });
		setDeleting(false);
	}
	const confirmDelete = async () => {
		if (!deleteInfo) return;
		await fetch("/api/degrees", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: deleteInfo.degree.id })
		});
		setDeleteInfo(null);
		reloadDegrees();
	}

	const handleCloseDialog = () => {
		setEditDegree(null)
		setEditForm(null)
		setDeleteInfo(null)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Danh sách bằng cấp</h1>
				<Link href="/quan-ly-giao-vien/bang-cap/them-moi">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Thêm bằng cấp
					</Button>
				</Link>
			</div>

			<div className="flex items-center space-x-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input type="search" placeholder="Tìm kiếm bằng cấp..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
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
								<TableHead className="text-right">Thao tác</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredDegrees.map((degree) => (
								<TableRow key={degree.id}>
									<TableCell className="font-medium">{degree.fullName}</TableCell>
									<TableCell>{degree.abbreviation}</TableCell>
									<TableCell className="text-right">
										<Button variant="outline" size="sm" onClick={() => handleEdit(degree)} className="ml-2">Sửa</Button>
										<Button variant="destructive" size="sm" onClick={() => handleDelete(degree)} className="ml-2" disabled={deleting}>Xóa</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			<Dialog open={!!editDegree} onOpenChange={open => { if (!open) handleCloseDialog() }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Sửa bằng cấp</DialogTitle>
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
						<div className="flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={() => handleCloseDialog()}>Hủy</Button>
							<Button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={!!deleteInfo} onOpenChange={open => { if (!open) setDeleteInfo(null); }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Xác nhận xóa bằng cấp</DialogTitle>
					</DialogHeader>
					{deleteInfo && (
						<div className="space-y-2">
							<p>Bạn có chắc muốn xóa bằng cấp <b>{deleteInfo.degree.fullName}</b>?</p>
							{deleteInfo.related?.teachers?.length > 0 && (
								<div className="text-sm text-red-600">
									<p>Các giáo viên liên quan sẽ bị xóa cùng:</p>
									<ul className="list-disc ml-5">
										{deleteInfo.related.teachers.map((teacher: any) => (
											<li key={teacher.id}>
												Mã GV: <b>{teacher.code}</b> - Họ tên: <b>{teacher.fullName}</b> - Email: <b>{teacher.email}</b>
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
