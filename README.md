# TinhLuongGiangVien

## Thông tin dự án

- **Tên dự án:** Tính Lương Giảng Viên
- **Nhóm:** PTTKPM25-26 Class N05 Nhóm 3
- **Mục tiêu:** Quản lý, tính toán lương giảng viên dựa trên các hệ số, bằng cấp, lớp học phần, phân công, v.v.
- **Công nghệ sử dụng:**
  - Next.js
  - TypeScript
  - Tailwind CSS
  - SQL Server (kết nối qua file `lib/connect_Sql.ts`)
- **Thư mục chính:**
  - `app/`: Chứa các route, trang, API liên quan đến chức năng nghiệp vụ
  - `components/`: Các component giao diện dùng chung
  - `hooks/`: Custom hooks
  - `lib/`: Các hàm tiện ích, kết nối cơ sở dữ liệu
  - `public/`: Tài nguyên tĩnh (hình ảnh, logo)
  - `styles/`: File CSS toàn cục
- **Tài liệu:**
  - `PTTKPM25-26_ClassN05_Nhom3.docx`: Tài liệu mô tả dự án
  - `uml_class_diagram.puml`, `uml_db_erd.puml`: Sơ đồ lớp, sơ đồ ERD

## Hướng dẫn sử dụng

1. Cài đặt các package:
   ```bash
   npm install
   ```
2. Chạy dự án:
   ```bash
   npm run dev
   ```
3. Truy cập giao diện tại: `http://localhost:3000`

## Thành viên nhóm
- Nguyễn Đặng Trường Quang

## Ghi chú
- Dự án sử dụng cấu trúc thư mục chuẩn của Next.js 13+ (App Router).
- Các chức năng chính: Quản lý giảng viên, lớp học phần, phân công, tính lương, thống kê.
- Vui lòng xem tài liệu và sơ đồ UML để hiểu rõ hơn về nghiệp vụ và kiến trúc hệ thống.
