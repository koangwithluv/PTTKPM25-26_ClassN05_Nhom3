import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

// Dữ liệu mẫu cho lớp học
const classes = [
  {
    id: 1,
    code: "IT001.1",
    name: "Nhập môn lập trình - Nhóm 1",
    course: "IT001",
    semester: "HK1 2023-2024",
    students: 40,
  },
  {
    id: 2,
    code: "IT001.2",
    name: "Nhập môn lập trình - Nhóm 2",
    course: "IT001",
    semester: "HK1 2023-2024",
    students: 35,
  },
  {
    id: 3,
    code: "IT002.1",
    name: "Lập trình hướng đối tượng - Nhóm 1",
    course: "IT002",
    semester: "HK1 2023-2024",
    students: 45,
  },
  {
    id: 4,
    code: "IT003.1",
    name: "Cấu trúc dữ liệu và giải thuật - Nhóm 1",
    course: "IT003",
    semester: "HK2 2023-2024",
    students: 50,
  },
  { id: 5, code: "IT004.1", name: "Cơ sở dữ liệu - Nhóm 1", course: "IT004", semester: "HK2 2023-2024", students: 55 },
]

// Dữ liệu mẫu cho kì học
const semesters = [
  { id: 1, name: "HK1 2023-2024" },
  { id: 2, name: "HK2 2023-2024" },
  { id: 3, name: "HK hè 2023-2024" },
]

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh sách lớp học</h1>
        <Link href="/quan-ly-lop-hoc-phan/lop-hoc/them-moi">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm lớp học
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Tìm kiếm lớp học..." className="pl-8" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn kì học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả kì học</SelectItem>
            {semesters.map((semester) => (
              <SelectItem key={semester.id} value={semester.id.toString()}>
                {semester.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã lớp</TableHead>
              <TableHead>Tên lớp</TableHead>
              <TableHead>Học phần</TableHead>
              <TableHead>Kì học</TableHead>
              <TableHead className="text-center">Số sinh viên</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell className="font-medium">{classItem.code}</TableCell>
                <TableCell>{classItem.name}</TableCell>
                <TableCell>{classItem.course}</TableCell>
                <TableCell>{classItem.semester}</TableCell>
                <TableCell className="text-center">{classItem.students}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/quan-ly-lop-hoc-phan/lop-hoc/${classItem.id}`}>
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
