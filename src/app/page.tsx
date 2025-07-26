// src/app/page.tsx
import { redirect } from "next/navigation";
import { getLoginCookie } from "@/app/utils/cookieLogin";

export default function Home() {
  const user = getLoginCookie();

  if (user.username) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return null;
}
