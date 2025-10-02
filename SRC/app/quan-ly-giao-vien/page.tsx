"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChevronRight, Home } from "lucide-react"

export default function QuanLyGiaoVienPage() {
  const router = useRouter()

  const menuItems = [
    {
      title: "Quản lý giáo viên",
      description: "Thêm, sửa, xóa thông tin giáo viên",
      path: "/quan-ly-giao-vien/giao-vien",
      color: "bg-blue-500"
    },
    {
      title: "Quản lý bằng cấp",
      description: "Quản lý các loại bằng cấp, học vị",
      path: "/quan-ly-giao-vien/bang-cap",
      color: "bg-green-500"
    },
    {
      title: "Quản lý khoa",
      description: "Quản lý thông tin các khoa, phòng ban",
      path: "/quan-ly-giao-vien/khoa",
      color: "bg-purple-500"
    },
    {
      title: "Thống kê",
      description: "Báo cáo và thống kê giáo viên",
      path: "/quan-ly-giao-vien/thong-ke",
      color: "bg-orange-500"
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
        <span className="text-gray-900 dark:text-white font-medium">Quản lý giáo viên</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Quản lý giáo viên
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Quản lý thông tin giáo viên, bằng cấp, khoa và thống kê
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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