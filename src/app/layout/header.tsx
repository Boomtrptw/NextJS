"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLoginCookie, clearLoginCookie } from "@/app/utils/cookieLogin";

export default function Header() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const { first_name, last_name, email } = getLoginCookie();
    setFullName(`${first_name} ${last_name}`.trim());
    setEmail(`${email}`.trim());
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    clearLoginCookie();
    router.push("/login");
  };
  return (
    <header
      style={{
        display: "flex",
        height: "54px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#164E63",
        color: "white",
      }}
    >
      <nav style={{ display: "flex", gap: "20px" }}>
        <a href="/dashboard" style={{ color: "white", textDecoration: "none" }}>
          Dashboard
        </a>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span style={{ fontSize: "12px" }}>{fullName || "ไม่ระบุชื่อ"}</span>
          <span style={{ fontSize: "10px" }}>{email}</span>
        </div>
        <button
          style={{
            backgroundColor: "#EF4444",
            border: "none",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
