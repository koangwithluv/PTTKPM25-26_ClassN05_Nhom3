"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn")
      if (!isLoggedIn && window.location.pathname !== "/login") {
        router.replace("/login")
      }
    }
  }, [])
  return <>{children}</>
}
