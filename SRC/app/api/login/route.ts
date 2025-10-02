import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/connect_Sql'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập đầy đủ thông tin!' },
        { status: 400 }
      )
    }

    // Kiểm tra thông tin đăng nhập trong database
    const query = `
      SELECT id, username, role 
      FROM users 
      WHERE username = ? AND password = ?
    `
    
    const [rows] = await db.execute(query, [username, password])
    const result = rows as any[]

    if (result.length > 0) {
      const user = result[0]
      return NextResponse.json({
        success: true,
        message: 'Đăng nhập thành công!',
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server!' },
      { status: 500 }
    )
  }
}
