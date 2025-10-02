"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChevronRight, Home } from "lucide-react"

export default function QuanLyLopHocPhanPage() {
  const router = useRouter()

  const menuItems = [
    {
      title: "Quản lý học phần",
      description: "Thêm, sửa, xóa thông tin học phần",
      path: "/quan-ly-lop-hoc-phan/hoc-phan",
      color: "bg-indigo-500"
    },
    {
      title: "Quản lý kỳ học",
      description: "Quản lý thông tin các kỳ học",
      path: "/quan-ly-lop-hoc-phan/ki-hoc",
      color: "bg-cyan-500"
    },
    {
      title: "Quản lý lớp học",
      description: "Quản lý thông tin lớp học",
      path: "/quan-ly-lop-hoc-phan/lop-hoc",
      color: "bg-pink-500"
    },
    {
      title: "Phân công giảng dạy",
      description: "Phân công giáo viên cho các lớp học",
      path: "/quan-ly-lop-hoc-phan/phan-cong",
      color: "bg-amber-500"
    },
    {
      title: "Thống kê",
      description: "Báo cáo và thống kê lớp học phần",
      path: "/quan-ly-lop-hoc-phan/thong-ke",
      color: "bg-teal-500"
    }
  ]

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
        <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
          <Home className="h-4 w-4 mr-1" />
          Trang chủ
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-white font-medium">Quản lý lớp học phần</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Quản lý lớp học phần
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Quản lý học phần, kỳ học, lớp học và phân công giảng dạy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Card 
            key={index}
            className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
            onClick={() => router.push(item.path)}
          >
            <CardHeader className="pb-3">
              <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
                <span className="text-white text-xl font-bold">
                  {item.title.charAt(3)}
                </span>
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}