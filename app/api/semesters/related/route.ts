import { NextResponse } from "next/server";
import { db } from "@/lib/connect_Sql";

// API trả về các dữ liệu liên quan đến kỳ học (classes, assignments)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const semesterId = searchParams.get("id");
  if (!semesterId) {
    return NextResponse.json({ error: "Missing semester id" }, { status: 400 });
  }
  try {
    // Lấy các lớp học thuộc kỳ học này
    const [classes]: any = await db.query(
      "SELECT * FROM Class WHERE semesterId = ?",
      [semesterId]
    );
    // Lấy các phân công liên quan đến các lớp học này, join lấy tên giảng viên
    let assignments = [];
    if (classes.length > 0) {
      const classIds = classes.map((c: any) => c.id);
      const [asmt]: any = await db.query(
        `SELECT a.*, t.fullName as teacherName, t.id as teacherId FROM Assignment a JOIN Teacher t ON a.lecturerId = t.id WHERE a.classId IN (${classIds.map(() => '?').join(',')})`,
        classIds
      );
      assignments = asmt;
    }
    return NextResponse.json({ classes, assignments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
