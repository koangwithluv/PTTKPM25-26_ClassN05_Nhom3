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
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
                🏫 Hệ thống quản lý giáo dục
              </Link>
            </div>
          </div>
        </header>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  )
}
