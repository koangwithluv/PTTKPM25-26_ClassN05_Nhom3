"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Dữ liệu mẫu cho bằng cấp
const degrees = [
	{ id: 1, fullName: "Tiến sĩ Khoa học máy tính", abbreviation: "TS.KHMT" },
	{ id: 2, fullName: "Thạc sĩ Công nghệ thông tin", abbreviation: "ThS.CNTT" },
	{ id: 3, fullName: "Kỹ sư Phần mềm", abbreviation: "KS.PM" },
	{ id: 4, fullName: "Cử nhân Tin học", abbreviation: "CN.TH" },
	{ id: 5, fullName: "Tiến sĩ Toán học", abbreviation: "TS.Toán" },
]

export default function DegreesPage() {
	const [search, setSearch] = useState("")
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
		</div>
	)
}
