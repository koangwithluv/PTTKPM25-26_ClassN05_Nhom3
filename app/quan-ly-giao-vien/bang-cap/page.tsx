"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function DegreesPage() {
	const [degrees, setDegrees] = useState<any[]>([])
	const [search, setSearch] = useState("")
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

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

	const filteredDegrees = degrees.filter((degree) =>
		degree.fullName.toLowerCase().includes(search.toLowerCase()) ||
		degree.abbreviation.toLowerCase().includes(search.toLowerCase())
	)

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
										<Link href={`/quan-ly-giao-vien/bang-cap/${degree.id}`}>
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
			)}
		</div>
	)
}
