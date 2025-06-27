"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showAlertError } from "../utils/sweetAlert";
import axios from "axios";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    firstname: false,
    lastname: false,
    username: false,
  });

  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    let formErrors = {
      email: !email || !validateEmail(email),
      password: !password,
      confirmPassword: password !== confirmPassword,
      firstname: !firstname,
      lastname: !lastname,
      username: !username,
    };

    setErrors(formErrors);

    if (Object.values(formErrors).includes(true)) {
      if (formErrors.password || formErrors.confirmPassword) {
        showAlertError("error", "Password ไม่ตรงกัน", "กรุณาตรวจสอบอีกครั้ง");
      } else if (formErrors.email) {
        showAlertError("error", "E-mail ไม่ถูกต้อง", "กรุณาตรวจสอบอีกครั้ง");
      }
      return;
    }

    const dataToSend = {
      email,
      password,
      firstname,
      lastname,
      username,
      profileImage: profileImage ? profileImage : null, // กรณีมีการเลือกโปรไฟล์ภาพ
    };

    try {
      // ส่งข้อมูลในรูปแบบ JSON
      const res = await axios.post("/api/register", dataToSend);

      if (res.status === 201) {
        showAlertError("success", "ลงทะเบียนสำเร็จ", "กรุณาเข้าสู่ระบบ");
        router.push("/login");
      }
    } catch (error) {
      if (error.response) {
        // เซิร์ฟเวอร์ตอบกลับเป็น error
        showAlertError(
          "error",
          "ลงทะเบียนไม่สำเร็จ",
          "กรุณาตรวจสอบและลองใหม่อีกครั้ง"
        );
      } else {
        // ถ้ามีข้อผิดพลาดอื่น ๆ เช่น การเชื่อมต่อไม่สำเร็จ
        showAlertError("error", "เกิดข้อผิดพลาด", "โปรดลองอีกครั้ง");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;

    if (field === "email") {
      setEmail(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: !validateEmail(value),
      }));
    } else {
      const setter = {
        username: setUsername,
        password: setPassword,
        confirmPassword: setConfirmPassword,
        firstname: setFirstname,
        lastname: setLastname,
      }[field];

      if (setter) setter(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: !value,
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="bg-white p-8 rounded-lg shadow-lg"
        style={{ width: "750px" }}
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Register
        </h1>

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <input
            type="file"
            onChange={(e) =>
              setProfileImage(e.target.files ? e.target.files[0] : null)
            }
            className="border p-2 rounded-md"
          />
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => handleChange(e, "username")}
            className={`w-full p-2 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } text-black rounded-md focus:outline-none`}
          />

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => handleChange(e, "password")}
                className={`w-full p-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } text-black rounded-md focus:outline-none`}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => handleChange(e, "confirmPassword")}
                className={`w-full p-2 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } text-black rounded-md focus:outline-none`}
              />
            </div>
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={firstname}
                onChange={(e) => handleChange(e, "firstname")}
                className={`w-full p-2 border ${
                  errors.firstname ? "border-red-500" : "border-gray-300"
                } text-black rounded-md focus:outline-none`}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => handleChange(e, "lastname")}
                className={`w-full p-2 border ${
                  errors.lastname ? "border-red-500" : "border-gray-300"
                } text-black rounded-md focus:outline-none`}
              />
            </div>
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => handleChange(e, "email")}
            className={`w-full p-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } text-black rounded-md focus:outline-none`}
          />

          {/* Register Button */}
          <button
            type="button"
            onClick={handleRegister}
            className="w-full p-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
