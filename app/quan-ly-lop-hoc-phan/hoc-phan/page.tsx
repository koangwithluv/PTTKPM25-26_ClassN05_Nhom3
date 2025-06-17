"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function CoursesPage() {
	const [courses, setCourses] = useState<any[]>([])
	const [classCoeffs, setClassCoeffs] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [search, setSearch] = useState("")

	useEffect(() => {
		const fetchCourses = async () => {
			setLoading(true)
			setError("")
			try {
				const [resCourses, resClassCoeffs] = await Promise.all([
					fetch("/api/coueses"),
					fetch("/api/tinh-tien-day/class-coeff")
				])
				if (!resCourses.ok) throw new Error("Lỗi tải danh sách học phần")
				if (!resClassCoeffs.ok) throw new Error("Lỗi tải hệ số lớp")
				const dataCourses = await resCourses.json()
				const dataClassCoeffs = await resClassCoeffs.json()
				setCourses(dataCourses)
				setClassCoeffs(dataClassCoeffs)
			} catch (err: any) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}
		fetchCourses()
	}, [])

	const filteredCourses = courses.filter((course) =>
		course.name.toLowerCase().includes(search.toLowerCase()) ||
		course.code.toLowerCase().includes(search.toLowerCase())
	)

	// Hàm tính hệ số lớp dựa trên số sinh viên và bảng hệ số lớp
	function getClassCoeff(studentCount: number) {
		if (!Array.isArray(classCoeffs) || classCoeffs.length === 0 || typeof studentCount !== 'number') return ''
		const coeff = classCoeffs.find((c: any) => studentCount >= c.minStudents && studentCount <= c.maxStudents)
		return coeff ? coeff.coeff : ''
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
								<TableHead className="text-center">Số SV</TableHead>
								<TableHead className="text-center">Hệ số lớp</TableHead>
								<TableHead className="text-right">Thao tác</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredCourses.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="text-center">Không có học phần nào</TableCell>
								</TableRow>
							) : (
								filteredCourses.map((course) => (
									<TableRow key={course.id}>
										<TableCell className="font-medium">{course.code}</TableCell>
										<TableCell>{course.name}</TableCell>
										<TableCell className="text-center">{course.credits}</TableCell>
										<TableCell className="text-center">{course.coefficient}</TableCell>
										<TableCell className="text-center">{course.periods}</TableCell>
										<TableCell className="text-center">{course.studentCount ?? ''}</TableCell>
										<TableCell className="text-center">{getClassCoeff(course.studentCount)}</TableCell>
										<TableCell className="text-right">
											<Link href={`/quan-ly-lop-hoc-phan/hoc-phan/${course.id}`}>
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
