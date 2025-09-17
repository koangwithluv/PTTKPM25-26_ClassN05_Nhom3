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
    console.log("Form submitted:", form)
    
    // Fake login logic, replace with real API call
    if (form.username === "admin" && form.password === "admin") {
      console.log("Login successful!")
      // Save login state (for demo, use localStorage)
      localStorage.setItem("isLoggedIn", "true")
      console.log("After setting localStorage:", localStorage.getItem("isLoggedIn"))
      console.log("Redirecting to dashboard...")
      // Sử dụng replace thay vì push để tránh quay lại login
      router.replace("/quan-ly-giao-vien/bang-cap")
    } else {
      console.log("Login failed!")
      setError("Sai tên đăng nhập hoặc mật khẩu!")
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
