'use client'
import Link from 'next/link'

export default function SidebarUC3() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-lg font-bold mb-6">Tính tiền dạy</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/tinh-tien-day" className="hover:bg-gray-100 rounded px-2 py-1">Tính tiền dạy</Link>
        <Link href="/tinh-tien-day/rate" className="hover:bg-gray-100 rounded px-2 py-1">Định mức tiền/tiết</Link>
        <Link href="/tinh-tien-day/degree-coeff" className="hover:bg-gray-100 rounded px-2 py-1">Hệ số giáo viên</Link>
        <Link href="/tinh-tien-day/class-coeff" className="hover:bg-gray-100 rounded px-2 py-1">Hệ số lớp</Link>
        <Link href="/tinh-tien-day/history" className="hover:bg-gray-100 rounded px-2 py-1">Lịch sử tính tiền dạy</Link>
      </nav>
    </aside>
  )
}
