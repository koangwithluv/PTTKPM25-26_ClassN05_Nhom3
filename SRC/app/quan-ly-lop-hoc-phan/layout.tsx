import type React from "react"
import MainSidebar from "@/components/main-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <MainSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
