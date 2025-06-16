"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Calendar,
  Users,
  UserCheck,
  BarChart3,
  GraduationCap,
  Building2,
  User,
  TrendingUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

const menuGroups = [
  {
    title: "Quản lý thông tin giáo viên",
    items: [
      {
        title: "Bằng cấp",
        href: "/quan-ly-giao-vien/bang-cap",
        icon: GraduationCap,
      },
      {
        title: "Khoa",
        href: "/quan-ly-giao-vien/khoa",
        icon: Building2,
      },
      {
        title: "Giáo viên",
        href: "/quan-ly-giao-vien/giao-vien",
        icon: User,
      },
      {
        title: "Thống kê giáo viên",
        href: "/quan-ly-giao-vien/thong-ke",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Quản lý lớp học phần",
    items: [
      {
        title: "Học phần",
        href: "/quan-ly-lop-hoc-phan/hoc-phan",
        icon: BookOpen,
      },
      {
        title: "Kì học",
        href: "/quan-ly-lop-hoc-phan/ki-hoc",
        icon: Calendar,
      },
      {
        title: "Lớp học",
        href: "/quan-ly-lop-hoc-phan/lop-hoc",
        icon: Users,
      },
      {
        title: "Phân công giảng viên",
        href: "/quan-ly-lop-hoc-phan/phan-cong",
        icon: UserCheck,
      },
      {
        title: "Thống kê",
        href: "/quan-ly-lop-hoc-phan/thong-ke",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Tính tiền dạy (UC3)",
    items: [
      {
        title: "Tính tiền dạy",
        href: "/tinh-tien-day",
        icon: BarChart3,
      },
      {
        title: "Định mức tiền/tiết",
        href: "/tinh-tien-day/rate",
        icon: BookOpen,
      },
      {
        title: "Hệ số giáo viên",
        href: "/tinh-tien-day/degree-coeff",
        icon: GraduationCap,
      },
      {
        title: "Hệ số lớp",
        href: "/tinh-tien-day/class-coeff",
        icon: Users,
      },
      {
        title: "Lịch sử tính tiền dạy",
        href: "/tinh-tien-day/history",
        icon: Calendar,
      },
    ],
  },
]

export default function MainSidebar() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "Quản lý thông tin giáo viên",
    "Quản lý lớp học phần",
    "Tính tiền dạy (UC3)",
  ])

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupTitle) ? prev.filter((title) => title !== groupTitle) : [...prev, groupTitle],
    )
  }

  return (
    <div className="w-64 border-r bg-background h-screen">
      <div className="h-16 flex items-center border-b px-6">
        <h1 className="font-semibold text-lg">Hệ thống quản lý</h1>
      </div>
      <nav className="p-4 space-y-2">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <button
              onClick={() => toggleGroup(group.title)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-left rounded-md hover:bg-muted transition-colors"
            >
              <span>{group.title}</span>
              {expandedGroups.includes(group.title) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {expandedGroups.includes(group.title) && (
              <div className="ml-4 space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}
