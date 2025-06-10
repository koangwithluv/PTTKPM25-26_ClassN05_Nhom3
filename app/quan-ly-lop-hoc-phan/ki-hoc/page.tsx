"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Dữ liệu mẫu cho kì học
const semesters = [
	{ id: 1, name: "Học kỳ 1", academicYear: "2023-2024", startDate: "15/08/2023", endDate: "31/12/2023" },
	{ id: 2, name: "Học kỳ 2", academicYear: "2023-2024", startDate: "15/01/2024", endDate: "31/05/2024" },
	{ id: 3, name: "Học kỳ hè", academicYear: "2023-2024", startDate: "01/06/2024", endDate: "31/07/2024" },
	{ id: 4, name: "Học kỳ 1", academicYear: "2022-2023", startDate: "15/08/2022", endDate: "31/12/2022" },
	{ id: 5, name: "Học kỳ 2", academicYear: "2022-2023", startDate: "15/01/2023", endDate: "31/05/2023" },
]

export default function SemestersPage() {
	const [search, setSearch] = useState("")
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
						{filteredSemesters.map((semester) => (
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
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
