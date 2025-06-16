"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function SemestersPage() {
	const [semesters, setSemesters] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [search, setSearch] = useState("")

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

	const filteredSemesters = semesters.filter((semester) =>
		semester.name.toLowerCase().includes(search.toLowerCase()) ||
		semester.academicYear.toLowerCase().includes(search.toLowerCase())
	)

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
										<TableCell>{semester.startDate}</TableCell>
										<TableCell>{semester.endDate}</TableCell>
										<TableCell className="text-right">
											<Link href={`/quan-ly-lop-hoc-phan/ki-hoc/${semester.id}`}>
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
