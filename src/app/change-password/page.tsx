"use client"; // Ensure this is at the top of the file

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showAlertError } from "../utils/sweetAlert";
import { EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({
    username: false,
    password: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    let formErrors = {
      username: !username,
      password: !password,
      newPassword: !newPassword,
      confirmNewPassword: newPassword !== confirmNewPassword,
    };

    setErrors(formErrors);

    if (Object.values(formErrors).includes(true)) {
      if (formErrors.confirmNewPassword) {
        showAlertError("warning", "Password ไม่ตรงกัน", "");
      } else {
        showAlertError("warning", "กรุณากรอกข้อมูลให้ครบถ้วน", "");
      }
      return; // Stop further processing
    }

    const dataToSend = {
      username,
      password,
      newPassword,
    };

    try {
      const res = await axios.post("/api/change-password", dataToSend, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        showAlertError("success", "เปลี่ยน Password สำเร็จ", "");
        router.push("/login");
      } else if (res.status === 404) {
        showAlertError("info", "ไม่พบ Username นี้ในระบบ", "");
      } else if (res.status === 403) {
        showAlertError("info", "รหัสผ่านเดิมไม่ถูกต้อง", "");
      } else {
        showAlertError(
          "error",
          "เปลี่ยน Password ไม่สำเร็จ",
          "กรุณาตรวจสอบและลองใหม่อีกครั้ง"
        );
      }
    } catch (error) {
      if (error.response) {
        showAlertError(
          "error",
          "เปลี่ยน Password ไม่สำเร็จ",
          "กรุณาตรวจสอบและลองใหม่อีกครั้ง"
        );
      } else {
        showAlertError("error", "เกิดข้อผิดพลาด", "โปรดลองอีกครั้ง");
      }
    }
  };

  const handleInputChange = (e, fieldName) => {
    // Reset the error for the field when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: false,
    }));

    if (fieldName === "username") setUsername(e.target.value);
    if (fieldName === "password") setPassword(e.target.value);
    if (fieldName === "newPassword") setNewPassword(e.target.value);
    if (fieldName === "confirmNewPassword")
      setConfirmNewPassword(e.target.value);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-800 to-black">
      <div
        className="bg-white p-8 rounded-lg shadow-lg"
        style={{ width: "500px" }}
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Change Password
        </h1>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => handleInputChange(e, "username")}
            className={`w-full p-2 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } text-black rounded-md focus:outline-none`}
          />

          <div className="space-y-4">
            {/* Current Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Current Password"
                value={password}
                onChange={(e) => handleInputChange(e, "password")}
                className={`w-full p-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } text-black rounded-md focus:outline-none`}
              />
              <EyeIcon
                className={`h-5 w-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                  showPassword ? "text-gray-800" : "text-gray-500"
                }`}
                onClick={togglePasswordVisibility}
              />
            </div>

            {/* New Password */}
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => handleInputChange(e, "newPassword")}
                className={`w-full p-2 border ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                } text-black rounded-md focus:outline-none`}
              />
              <EyeIcon
                className={`h-5 w-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                  showNewPassword ? "text-gray-800" : "text-gray-500"
                }`}
                onClick={toggleNewPasswordVisibility}
              />
            </div>

            {/* Confirm New Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => handleInputChange(e, "confirmNewPassword")}
                className={`w-full p-2 border ${
                  errors.confirmNewPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } text-black rounded-md focus:outline-none`}
              />
              <EyeIcon
                className={`h-5 w-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                  showConfirmPassword ? "text-gray-800" : "text-gray-500"
                }`}
                onClick={toggleConfirmPasswordVisibility}
              />
            </div>
          </div>

          {/* Change Password Button */}
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
