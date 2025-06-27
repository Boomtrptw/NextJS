import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../../db";
import bcrypt from "bcrypt";
import { User } from "../../../app/utils/models/model_user"; // นำเข้า Model User

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstname, lastname, username, profileImage } =
      await req.json();

    if (!email || !password || !firstname || !lastname || !username) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const lowerCaseUsername = username.toLowerCase();
    const lowerCaseEmail = email.toLowerCase();

    const existingUser = await pool.query(
      "SELECT * FROM public.users WHERE LOWER(username) = $1 OR LOWER(email) = $2",
      [lowerCaseUsername, lowerCaseEmail]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: "Username หรือ E-mail นี้มีการใช้งานแล้ว" },
        { status: 400 }
      );
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO public.users (username, password, first_name, last_name, email, profile_image)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, first_name, last_name, email, profile_image`,
      [
        lowerCaseUsername,
        hashedPassword,
        firstname,
        lastname,
        lowerCaseEmail,
        profileImage || null,
      ]
    );

    const newUser: User = result.rows[0];

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลงทะเบียน" },
      { status: 500 }
    );
  }
}
