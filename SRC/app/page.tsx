"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const userData = localStorage.getItem("user")
    
    if (!loggedIn) {
      router.push("/login")
      return
    }
    
    setIsLoggedIn(true)
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!isLoggedIn) {
    return <div>Đang kiểm tra đăng nhập...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Hệ thống tính lương giảng viên</h1>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Xin chào, <strong>{user.username}</strong> ({user.role})
                </span>
              )}
              <Button variant="outline" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => router.push("/quan-ly-giao-vien")}>
            <CardHeader>
              <CardTitle className="text-lg">Quản lý giáo viên</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Quản lý thông tin giáo viên, bằng cấp, khoa và thống kê
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => router.push("/quan-ly-lop-hoc-phan")}>
            <CardHeader>
              <CardTitle className="text-lg">Quản lý lớp học phần</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Quản lý học phần, kì học, lớp học và phân công giảng dạy
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => router.push("/tinh-tien-day")}>
            <CardHeader>
              <CardTitle className="text-lg">Tính tiền dạy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tính toán lương giảng dạy, hệ số và thống kê
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
