"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function TeachersPage() {
	const [teachers, setTeachers] = useState<any[]>([])
	const [departments, setDepartments] = useState<any[]>([])
	const [degrees, setDegrees] = useState<any[]>([])
	const [filterDepartment, setFilterDepartment] = useState<string>("all")
	const [search, setSearch] = useState("")

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
									<Link href={`/quan-ly-giao-vien/giao-vien/${teacher.id}`}>
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
