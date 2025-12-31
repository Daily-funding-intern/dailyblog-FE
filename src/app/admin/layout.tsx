"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인 페이지는 인증 체크 스킵
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    // const token = localStorage.getItem("admin_token");

    // if (!token) {
    //   router.push("/admin/login");
    //   return;
    // }

    // // 토큰 유효성 검증 (선택사항)
    // verifyToken(token);
  }, [pathname, router]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/verify/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      }
    } catch (error) {
      localStorage.removeItem("admin_token");
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // 로그인 페이지는 레이아웃 없이 표시
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="admin_layout">
      <aside className="admin_sidebar">
        <div className="logo_section">
          <img src="/Img/dailyfunding.png" alt="로고" />
          <h2>관리자</h2>
        </div>

        <nav className="admin_nav">
          <a href="/admin" className={pathname === "/admin" ? "active" : ""}>
            대시보드
          </a>
          <a
            href="/admin/posts"
            className={pathname.startsWith("/admin/posts") ? "active" : ""}
          >
            글 관리
          </a>
          <a
            href="/admin/categories"
            className={pathname === "/admin/categories" ? "active" : ""}
          >
            카테고리 관리
          </a>
        </nav>

        <button onClick={handleLogout} className="logout_btn">
          로그아웃
        </button>
      </aside>

      <main className="admin_content">{children}</main>
    </div>
  );
}
