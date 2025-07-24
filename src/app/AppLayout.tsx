"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./layout/header";
import Footer from "./layout/footer";
import { getLoginCookie } from "@/app/utils/cookieLogin";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const noHeaderFooterPages = ["/login", "/change-password"];
  const isAuthPage = noHeaderFooterPages.includes(pathname);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { username } = getLoginCookie();

    if (!username && !isAuthPage) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, [pathname]);

  if (loading) return null;

  return (
    <>
      {!isAuthPage && <Header />}
      <main>{isAuthenticated || isAuthPage ? children : null}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
