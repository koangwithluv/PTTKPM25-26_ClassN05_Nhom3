"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ClassesPage() {
	const [classes, setClasses] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [search, setSearch] = useState("")
	const [semesters, setSemesters] = useState<any[]>([])
	const [selectedSemester, setSelectedSemester] = useState("all")

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			setError("")
			try {
				const [classesRes, semestersRes] = await Promise.all([
					fetch("/api/classes"),
					fetch("/api/semesters")
				])
				if (!classesRes.ok) throw new Error("Lỗi tải danh sách lớp học")
				if (!semestersRes.ok) throw new Error("Lỗi tải danh sách kì học")
				const classesData = await classesRes.json()
				const semestersData = await semestersRes.json()
				setClasses(classesData)
				setSemesters(semestersData)
			} catch (err: any) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [])

	const filteredClasses = classes.filter((classItem) => {
		const matchSearch =
			classItem.name?.toLowerCase().includes(search.toLowerCase()) ||
			classItem.code?.toLowerCase().includes(search.toLowerCase())
		const matchSemester =
			selectedSemester === "all" || classItem.semesterId?.toString() === selectedSemester
		return matchSearch && matchSemester
	})

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
										<TableCell>{classItem.courseCode || classItem.course}</TableCell>
										<TableCell>{semesters.find((s: any) => s.id === classItem.semesterId)?.name || classItem.semester}</TableCell>
										<TableCell className="text-center">{classItem.students}</TableCell>
										<TableCell className="text-right">
											<Link href={`/quan-ly-lop-hoc-phan/lop-hoc/${classItem.id}`}>
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
