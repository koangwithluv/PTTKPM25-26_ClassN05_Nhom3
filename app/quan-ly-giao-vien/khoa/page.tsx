import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

// Dữ liệu mẫu cho khoa
const departments = [
  {
    id: 1,
    fullName: "Khoa Công nghệ thông tin",
    abbreviation: "CNTT",
    description: "Đào tạo và nghiên cứu trong lĩnh vực công nghệ thông tin, phần mềm và hệ thống thông tin",
  },
  {
    id: 2,
    fullName: "Khoa Toán - Tin",
    abbreviation: "Toán-Tin",
    description: "Đào tạo và nghiên cứu toán học ứng dụng và khoa học máy tính",
  },
  {
    id: 3,
    fullName: "Khoa Điện tử - Viễn thông",
    abbreviation: "ĐTVT",
    description: "Đào tạo kỹ sư điện tử, viễn thông và kỹ thuật máy tính",
  },
  {
    id: 4,
    fullName: "Khoa Cơ khí",
    abbreviation: "CK",
    description: "Đào tạo kỹ sư cơ khí, chế tạo máy và tự động hóa",
  },
  {
    id: 5,
    fullName: "Khoa Kinh tế",
    abbreviation: "KT",
    description: "Đào tạo cử nhân kinh tế, quản trị kinh doanh và tài chính",
  },
]

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh sách khoa</h1>
        <Link href="/quan-ly-giao-vien/khoa/them-moi">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm khoa
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Tìm kiếm khoa..." className="pl-8" />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên đầy đủ</TableHead>
              <TableHead>Tên viết tắt</TableHead>
              <TableHead>Mô tả nhiệm vụ</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.fullName}</TableCell>
                <TableCell>{department.abbreviation}</TableCell>
                <TableCell className="max-w-md truncate">{department.description}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/quan-ly-giao-vien/khoa/${department.id}`}>
                    <Button variant="ghost" size="sm">
                      Chi tiết
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
