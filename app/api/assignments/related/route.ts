import { NextResponse } from "next/server";
import { db } from "@/lib/connect_Sql";

// API trả về các dữ liệu liên quan đến phân công (nếu có)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const assignmentId = searchParams.get("id");
  if (!assignmentId) {
    return NextResponse.json({ error: "Missing assignment id" }, { status: 400 });
  }
  try {
    // Lấy thông tin phân công
    const [assignments]: any = await db.query(
      "SELECT * FROM Assignment WHERE id = ?",
      [assignmentId]
    );
    // Lấy thông tin lớp học và giáo viên liên quan
    let classInfo = null, teacherInfo = null;
    if (assignments.length > 0) {
      const a = assignments[0];
      const [classes]: any = await db.query("SELECT * FROM Class WHERE id = ?", [a.classId]);
      const [teachers]: any = await db.query("SELECT * FROM Teacher WHERE id = ?", [a.teacherId]);
      classInfo = classes[0] || null;
      teacherInfo = teachers[0] || null;
    }
    return NextResponse.json({ assignment: assignments[0] || null, class: classInfo, teacher: teacherInfo });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
