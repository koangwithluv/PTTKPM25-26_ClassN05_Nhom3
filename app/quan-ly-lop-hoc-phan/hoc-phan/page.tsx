"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Dữ liệu mẫu cho học phần
const courses = [
	{ id: 1, code: "IT001", name: "Nhập môn lập trình", credits: 3, coefficient: 1.5, periods: 45 },
	{ id: 2, code: "IT002", name: "Lập trình hướng đối tượng", credits: 4, coefficient: 1.8, periods: 60 },
	{ id: 3, code: "IT003", name: "Cấu trúc dữ liệu và giải thuật", credits: 4, coefficient: 2.0, periods: 60 },
	{ id: 4, code: "IT004", name: "Cơ sở dữ liệu", credits: 4, coefficient: 1.8, periods: 60 },
	{ id: 5, code: "IT005", name: "Mạng máy tính", credits: 3, coefficient: 1.5, periods: 45 },
]

export default function CoursesPage() {
	const [search, setSearch] = useState("")
	const filteredCourses = courses.filter((course) =>
		course.name.toLowerCase().includes(search.toLowerCase()) ||
		course.code.toLowerCase().includes(search.toLowerCase())
	)

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
						{filteredCourses.map((course) => (
							<TableRow key={course.id}>
								<TableCell className="font-medium">{course.code}</TableCell>
								<TableCell>{course.name}</TableCell>
								<TableCell className="text-center">{course.credits}</TableCell>
								<TableCell className="text-center">{course.coefficient}</TableCell>
								<TableCell className="text-center">{course.periods}</TableCell>
								<TableCell className="text-right">
									<Link href={`/quan-ly-lop-hoc-phan/hoc-phan/${course.id}`}>
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
