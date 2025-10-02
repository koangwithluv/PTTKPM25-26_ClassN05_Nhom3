"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Dữ liệu mẫu cho khoa
const departments = [
	{ id: 1, name: "Khoa Công nghệ thông tin", abbreviation: "CNTT" },
	{ id: 2, name: "Khoa Toán - Tin", abbreviation: "Toán-Tin" },
	{ id: 3, name: "Khoa Điện tử - Viễn thông", abbreviation: "ĐTVT" },
	{ id: 4, name: "Khoa Cơ khí", abbreviation: "CK" },
	{ id: 5, name: "Khoa Kinh tế", abbreviation: "KT" },
]

// Dữ liệu mẫu cho bằng cấp
const degrees = [
	{ id: 1, fullName: "Tiến sĩ Khoa học máy tính", abbreviation: "TS.KHMT" },
	{ id: 2, fullName: "Thạc sĩ Công nghệ thông tin", abbreviation: "ThS.CNTT" },
	{ id: 3, fullName: "Kỹ sư Phần mềm", abbreviation: "KS.PM" },
	{ id: 4, fullName: "Cử nhân Tin học", abbreviation: "CN.TH" },
	{ id: 5, fullName: "Tiến sĩ Toán học", abbreviation: "TS.Toán" },
]

export default function AddTeacherPage() {
	const [formData, setFormData] = useState({
		code: "",
		fullName: "",
		dateOfBirth: "",
		phone: "",
		email: "",
		departmentId: "",
		degreeId: "",
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const res = await fetch("/api/teachers", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					departmentId: formData.departmentId ? Number(formData.departmentId) : null,
					degreeId: formData.degreeId ? Number(formData.degreeId) : null,
				}),
			})
			if (!res.ok) throw new Error("Lỗi khi thêm giáo viên!")
			// Sau khi thêm thành công, chuyển hướng về trang danh sách
			window.location.href = "/quan-ly-giao-vien/giao-vien"
		} catch (err) {
			alert("Thêm giáo viên thất bại!")
			console.error(err)
		}
	}

	const generateCode = () => {
		// Tự động sinh mã giáo viên
		const randomCode =
			"GV" +
			Math.floor(Math.random() * 1000)
				.toString()
				.padStart(3, "0")
		setFormData((prev) => ({ ...prev, code: randomCode }))
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<Link href="/quan-ly-giao-vien/giao-vien">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<h1 className="text-2xl font-bold">Thêm giáo viên mới</h1>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Thông tin giáo viên</CardTitle>
					<CardDescription>Nhập đầy đủ thông tin để tạo giáo viên mới</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="code">Mã số giáo viên</Label>
								<div className="flex gap-2">
									<Input
										id="code"
										name="code"
										placeholder="Nhập mã số hoặc để trống để tự sinh"
										value={formData.code}
										onChange={handleChange}
									/>
									<Button type="button" variant="outline" onClick={generateCode}>
										Tự sinh
									</Button>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="fullName">Họ tên</Label>
								<Input
									id="fullName"
									name="fullName"
									placeholder="Nhập họ tên đầy đủ"
									value={formData.fullName}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="dateOfBirth">Ngày sinh</Label>
								<Input
									id="dateOfBirth"
									name="dateOfBirth"
									type="date"
									value={formData.dateOfBirth}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Điện thoại</Label>
								<Input
									id="phone"
									name="phone"
									placeholder="Nhập số điện thoại"
									value={formData.phone}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="Nhập địa chỉ email"
									value={formData.email}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="departmentId">Khoa</Label>
								<Select
									value={formData.departmentId}
									onValueChange={(value) => handleSelectChange("departmentId", value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Chọn khoa" />
									</SelectTrigger>
									<SelectContent>
										{departments.map((department) => (
											<SelectItem key={department.id} value={department.id.toString()}>
												{department.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="degreeId">Bằng cấp</Label>
								<Select value={formData.degreeId} onValueChange={(value) => handleSelectChange("degreeId", value)}>
									<SelectTrigger>
										<SelectValue placeholder="Chọn bằng cấp" />
									</SelectTrigger>
									<SelectContent>
										{degrees.map((degree) => (
											<SelectItem key={degree.id} value={degree.id.toString()}>
												{degree.fullName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex justify-end space-x-2">
							<Link href="/quan-ly-giao-vien/giao-vien">
								<Button variant="outline">Hủy</Button>
							</Link>
							<Button type="submit">Lưu</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
