# Hệ thống Quản lý Giáo dục - Authentication Testing

## Hướng dẫn Test Authentication Flow

### 1. Khởi chạy server
```bash
npm run dev
```
Server sẽ chạy tại: http://localhost:3001

### 2. Test Authentication Flow

#### Bước 1: Truy cập trang chủ khi chưa đăng nhập
- Mở browser và truy cập: `http://localhost:3001`
- Hệ thống sẽ tự động redirect đến trang đăng nhập (`/login`)

#### Bước 2: Đăng nhập với tài khoản test
Sử dụng một trong các tài khoản sau:

**Admin:**
- Username: `admin`  
- Password: `admin`

**User:**
- Username: `user`
- Password: `user`

**Teacher:**
- Username: `teacher`
- Password: `teacher`

#### Bước 3: Kiểm tra tính năng
- Sau khi đăng nhập thành công, header sẽ hiển thị tên user và nút "Đăng xuất"
- Truy cập trang test: `http://localhost:3001/test-auth` để xem thông tin authentication
- Click "Đăng xuất" để test logout flow

### 3. Test Cases

#### Test Case 1: Unauthenticated Access
1. Xóa cache browser hoặc clear localStorage
2. Truy cập `http://localhost:3001`
3. **Expected:** Redirect to login page

#### Test Case 2: Login Flow  
1. Từ trang login, nhập username/password hợp lệ
2. Click "Đăng nhập"
3. **Expected:** Redirect to dashboard, header shows user info

#### Test Case 3: Protected Route Access
1. Khi chưa đăng nhập, truy cập route bất kỳ (ví dụ: `/quan-ly-giao-vien`)
2. **Expected:** Redirect to login page

#### Test Case 4: Logout Flow
1. Khi đã đăng nhập, click nút "Đăng xuất" ở header
2. **Expected:** Clear auth data, redirect to login page

#### Test Case 5: Session Persistence  
1. Đăng nhập thành công
2. Refresh page hoặc đóng tab rồi mở lại
3. **Expected:** Vẫn duy trì trạng thái đăng nhập

### 4. API Endpoints

#### POST /api/login
```json
{
  "username": "admin",
  "password": "admin"  
}
```

**Response thành công:**
```json
{
  "success": true,
  "token": "auth-token-xyz",
  "user": {
    "id": 1,
    "username": "admin", 
    "name": "Administrator",
    "role": "admin"
  }
}
```

### 5. Troubleshooting

#### Lỗi "Port 3000 is in use"
- Server tự động chuyển sang port 3001
- Truy cập: `http://localhost:3001`

#### Lỗi không redirect đến login  
- Check browser console cho errors
- Clear browser cache và localStorage
- Kiểm tra component AuthGuard và HeaderAuth

#### Database connection issues
- Kiểm tra MySQL server đang chạy
- Verify connection settings trong `lib/connect_Sql.ts`

### 6. File Structure Authentication

```
app/
├── page.tsx                 # Home page với auth checking
├── login/page.tsx          # Login form
├── layout.tsx              # Root layout với HeaderAuth
├── test-auth/page.tsx      # Test authentication status
└── api/login/route.ts      # Authentication API

components/
├── AuthGuard.tsx           # Route protection component  
└── HeaderAuth.tsx          # Smart header với login/logout

lib/
├── connect_Sql.ts          # Database connection
└── utils.ts               # Utility functions
```

### 7. Authentication Flow Diagram

```
Unauthenticated User
         ↓
    Access any route
         ↓
    AuthGuard checks localStorage
         ↓
    No auth token found
         ↓
    Redirect to /login
         ↓
    User submits login form
         ↓
    API validates credentials
         ↓
    Save token to localStorage
         ↓
    Redirect to dashboard
         ↓
    Authenticated state
```