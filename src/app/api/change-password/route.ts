import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../../db";

// ฟังก์ชันการเปลี่ยนรหัสผ่าน
export async function POST(request: NextRequest) {
  try {
    // ดึงข้อมูลจาก body ของ request เพียงครั้งเดียว
    const { username, password, newPassword } = await request.json();

    // Log the request body to debug (ครั้งเดียว)
    console.log("Received request body: ", { username, password, newPassword });

    // ตรวจสอบข้อมูลที่ได้รับ
    if (!username || !password || !newPassword) {
      console.log("Missing fields: ", { username, password, newPassword });
      return NextResponse.json(
        { message: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }

    const client = await pool.connect(); // เชื่อมต่อกับฐานข้อมูล
    // ค้นหาผู้ใช้จากฐานข้อมูลตามชื่อผู้ใช้
    const userQuery = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = userQuery.rows[0]; // ค่าผู้ใช้ที่ค้นพบ

    if (!user) {
      return NextResponse.json({ message: "ไม่พบผู้ใช้นี้" }, { status: 400 });
    }

    // เปรียบเทียบรหัสผ่านเดิม
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "รหัสผ่านเดิมไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // เข้ารหัสรหัสผ่านใหม่
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
    await client.query("UPDATE users SET password = $1 WHERE username = $2", [
      hashedNewPassword,
      username,
    ]);

    return NextResponse.json(
      { message: "เปลี่ยนรหัสผ่านสำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in changing password:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
