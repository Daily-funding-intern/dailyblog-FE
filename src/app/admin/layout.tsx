"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    // 로그인 페이지는 검증 스킵
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    try {
      // Django 세션 확인 API 호출
      const response = await fetch("http://127.0.0.1:8000/api/check-auth/", {
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        // 인증 실패 시 로그인 페이지로
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("인증 확인 실패:", error);
      router.push("/admin/login");
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>로딩 중...</p>
      </div>
    );
  }

  return <>{children}</>;
}
