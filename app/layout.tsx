import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AuthGuard from "@/components/AuthGuard"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hệ thống quản lý giáo dục",
  description: "Hệ thống quản lý thông tin giáo viên và lớp học phần",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthGuard>{children}</AuthGuard>
        <div className="flex items-center justify-end p-4">
          <Link href="/login">
            <Button variant="outline">Đăng nhập</Button>
          </Link>
        </div>
      </body>
    </html>
  )
}
