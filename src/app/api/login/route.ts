import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = body.user?.trim().toLowerCase();
    const password = body.password;

    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      user,
    ]);
    const user_data = result.rows[0];

    if (!user_data) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user_data.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user_data.id, username: user_data.user },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        username: user_data.username,
        first_name: user_data.first_name,
        last_name: user_data.last_name,
        email: user_data.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
