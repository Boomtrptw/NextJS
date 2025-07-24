import { NextResponse } from "next/server";
import { pool } from "../../../../db";

export async function GET() {
  try {
    // ดึงข้อมูลจาก grades
    const gradesQuery = "SELECT * FROM grades ORDER BY year, term";
    const gradesRes = await pool.query(gradesQuery);

    // ดึงข้อมูลจาก tech_stack
    const techStackQuery = "SELECT * FROM tech_stack ORDER BY name";
    const techStackRes = await pool.query(techStackQuery);

    // รวมข้อมูลทั้งสองตารางในรูปแบบ JSON
    return NextResponse.json({
      grades: gradesRes.rows,
      tech_stack: techStackRes.rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}