"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn")
      const currentPath = window.location.pathname
      
      console.log("AuthGuard check:", { isLoggedIn, currentPath })
      
      if (!isLoggedIn && currentPath !== "/login") {
        console.log("Not logged in, redirecting to login")
        router.replace("/login")
      } else if (isLoggedIn && currentPath === "/login") {
        console.log("Already logged in, redirecting from login page")
        router.replace("/quan-ly-giao-vien/bang-cap")
      }
      
      setIsChecking(false)
    }
  }, [router])

  if (isChecking) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
