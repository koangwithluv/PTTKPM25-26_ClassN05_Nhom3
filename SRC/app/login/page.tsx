"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (data.success) {
        // Save login state và user info
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push("/")
      } else {
        setError(data.message || "Đăng nhập thất bại!")
      }
    } catch (error) {
      console.error('Login error:', error)
      setError("Lỗi kết nối server!")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Đăng nhập hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="username"
              placeholder="Tên đăng nhập"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
            />
            <Input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              required
            />
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full">Đăng nhập</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
