"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  userId: string;
  username: string;
  exp: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setUsername(decoded.username);
    } catch (err) {
      console.error("Token decode error:", err);
      localStorage.removeItem("authToken");
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎉 Welcome, {username}
        </h1>
        <p className="text-gray-600 mb-4">คุณเข้าสู่ระบบแล้ว</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
