import { NextResponse } from "next/server";
import { db } from "@/lib/connect_Sql";

// API trả về các dữ liệu liên quan đến lớp học (assignments)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("id");
  if (!classId) {
    return NextResponse.json({ error: "Missing class id" }, { status: 400 });
  }
  try {
    // Lấy các phân công liên quan đến lớp học này
    const [assignments]: any = await db.query(
      "SELECT * FROM Assignment WHERE classId = ?",
      [classId]
    );
    return NextResponse.json({ assignments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
