"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeaderAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem("authToken")
      const isLoggedIn = localStorage.getItem("isLoggedIn")
      const userData = localStorage.getItem("userInfo")
      
      setIsAuthenticated(!!(authToken || isLoggedIn))
      
      if (userData) {
        try {
          setUserInfo(JSON.parse(userData))
        } catch (e) {
          console.error("Error parsing user info:", e)
        }
      }
    }

    checkAuth()
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userInfo")
    setIsAuthenticated(false)
    setUserInfo(null)
    router.push("/login")
  }

  // Không hiển thị gì ở trang login
  if (pathname === "/login") {
    return null
  }

  return (
    <div className="flex items-center justify-end p-4 border-b bg-white">
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          {userInfo && (
            <span className="text-sm text-gray-600">
              Xin chào, <strong>{userInfo.name || userInfo.username}</strong>
            </span>
          )}
          <Button variant="outline" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      ) : (
        <Link href="/login">
          <Button variant="outline">Đăng nhập</Button>
        </Link>
      )}
    </div>
  )
}