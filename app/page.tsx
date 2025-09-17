"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Chỉ chạy trên client-side
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn")
      console.log("Home page - isLoggedIn:", isLoggedIn)
      
      if (isLoggedIn) {
        console.log("User is logged in, redirecting to dashboard")
        router.replace("/quan-ly-giao-vien/bang-cap")
      } else {
        console.log("User not logged in, redirecting to login")
        router.replace("/login")
      }
    }
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Đang chuyển hướng...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </main>
  )
}
