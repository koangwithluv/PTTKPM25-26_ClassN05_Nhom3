# Biểu đồ Gói - Hệ thống Quản lý Tính Lương Giảng Viên

## Mục đích
Biểu đồ gói (Package Diagram) được sử dụng để:
- Tổ chức và phân chia hệ thống thành các tầng logic
- Thể hiện cấu trúc kiến trúc tổng thể của hệ thống
- Mô tả các mối quan hệ phụ thuộc giữa các gói
- Hỗ trợ việc phát triển và bảo trì hệ thống

## Kiến trúc Tầng (Layered Architecture)

### 1. Tầng Giao diện (UI Layer)
**Vai trò:** Xử lý tương tác với người dùng
- **components/**: Các thành phần giao diện tái sử dụng
  - Button, Input, Card, Table, Dialog, Form
  - Sidebar, Header, Layout components
- **pages/**: Các trang chính của ứng dụng
  - Trang đăng nhập, Trang chủ
  - Quản lý giáo viên, Quản lý lớp học phần
  - Tính tiền dạy
- **layouts/**: Bố cục và template chung

### 2. Tầng Logic Nghiệp vụ (Service Layer)
**Vai trò:** Xử lý quy trình kinh doanh và logic ứng dụng
- **auth/**: Dịch vụ xác thực và phân quyền
  - Đăng nhập, Xác thực token
  - Phân quyền người dùng
- **giaovien/**: Dịch vụ quản lý giáo viên
  - CRUD giáo viên, bằng cấp, khoa
  - Thống kê và báo cáo
- **lophocphan/**: Dịch vụ quản lý lớp học phần
  - CRUD học phần, kỳ học, lớp học
  - Phân công giảng dạy
- **tinhluong/**: Dịch vụ tính lương
  - Tính toán lương giảng dạy
  - Quản lý hệ số, lịch sử

### 3. Tầng Truy cập Dữ liệu (Repository Layer)
**Vai trò:** Trừu tượng hóa việc truy cập dữ liệu
- **interfaces/**: Định nghĩa contract cho data access
  - IGiaoVienRepository, IBangCapRepository
  - IHocPhanRepository, ITinhLuongRepository
- **implementations/**: Triển khai cụ thể
  - MySQL implementations
  - Xử lý truy vấn SQL
- **database/**: Quản lý kết nối cơ sở dữ liệu
  - Connection pooling
  - Transaction management

### 4. Tầng Đối tượng (Domain Layer)
**Vai trò:** Chứa các đối tượng nghiệp vụ cốt lõi
- **entities/**: Các thực thể chính
  - GiaoVien, BangCap, Khoa
  - HocPhan, KiHoc, LopHoc
  - PhanCongGiangDay, TinhLuong
- **valueobjects/**: Các đối tượng giá trị
  - ThongTinCaNhan, ThongTinLienHe
- **enums/**: Các hằng số và enumeration
  - TrangThaiGiaoVien, LoaiBangCap
  - VaiTroNguoiDung

## Mối quan hệ Phụ thuộc

### Nguyên tắc Dependency
1. **UI** phụ thuộc vào **Service**
   - Giao diện gọi API thông qua service layer
   - Không truy cập trực tiếp vào database

2. **Service** phụ thuộc vào **Repository**
   - Business logic sử dụng repository pattern
   - Tách biệt logic nghiệp vụ và data access

3. **Repository** phụ thuộc vào **Domain**
   - Data access layer sử dụng domain entities
   - Mapping giữa database và domain objects

4. **Service** phụ thuộc vào **Domain**
   - Business logic xử lý domain objects
   - Áp dụng business rules

### Lợi ích của Kiến trúc Tầng
- **Tách biệt mối quan tâm**: Mỗi tầng có trách nhiệm riêng biệt
- **Dễ bảo trì**: Thay đổi ở một tầng không ảnh hưởng tầng khác
- **Có thể kiểm thử**: Mock dependencies dễ dàng
- **Tái sử dụng**: Components và services có thể tái sử dụng
- **Mở rộng**: Dễ dàng thêm tính năng mới

## Triển khai trong Next.js

### Cấu trúc Thư mục
```
SRC/
├── app/                    # UI Layer - Next.js App Router
│   ├── api/               # API Routes (Service Layer)
│   ├── quan-ly-giao-vien/ # Teacher Management Pages
│   ├── quan-ly-lop-hoc-phan/ # Class Management Pages
│   └── tinh-tien-day/     # Salary Calculation Pages
├── components/            # UI Components
│   └── ui/               # Reusable UI Components
├── lib/                  # Repository Layer
│   └── connect_Sql.ts    # Database Connection
├── hooks/                # Custom React Hooks
└── public/               # Static Assets
```

### Luồng Dữ liệu
1. **UI Component** → gọi API endpoint
2. **API Route** → xử lý business logic
3. **Database Connection** → thực hiện truy vấn SQL
4. **MySQL Database** → trả về dữ liệu
5. **API Route** → format và validate dữ liệu
6. **UI Component** → hiển thị cho người dùng

## Kết luận
Biểu đồ gói giúp:
- Visualize kiến trúc hệ thống
- Đảm bảo separation of concerns
- Hỗ trợ team development
- Dễ dàng maintain và extend
- Chuẩn hóa code structure