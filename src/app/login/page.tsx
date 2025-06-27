"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { showAlertError } from "../utils/sweetAlert";
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/login", {
        username,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("authToken", token);

      // ✅ แสดงข้อความสำเร็จจาก Swal
      await showAlertError("success", "Login สำเร็จ!", "");

      // ✅ เมื่อผู้ใช้กด "ตกลง" แล้ว ทำการ redirect ไปหน้า dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      showAlertError(
        "error",
        "Login ไม่สำเร็จ",
        err.response?.data?.message || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-800 to-black">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded px-4 py-2 focus:outline-none text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-4 py-2 focus:outline-none text-black"
          />
          <div className="flex justify-between">
            <label className="text-red-500 text-xs cursor-pointer hover:underline">
              Change Password
            </label>
            <label className="text-red-500 text-xs cursor-pointer hover:underline">
              Forget Password
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
          style={{ width: "100%" }}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
