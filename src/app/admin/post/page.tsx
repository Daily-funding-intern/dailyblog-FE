"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiGet, apiDelete } from "@/lib/api";
import { Article } from "@/app/types";
import "../admin.css";
import Link from "next/link";

export default function AdminPostPage() {
  const router = useRouter();

  // 페이지 진입 시 인증 확인
  const { isAuthenticated, isLoading: authLoading } = useAuth({
    requireAuth: true,
  });

  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 인증 완료 후에만 데이터 로드
  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts(currentPage);
    }
  }, [currentPage, isAuthenticated]);

  const PAGE_SIZE = 6;

  const fetchPosts = async (page: number) => {
    try {
      // fetchWithAuth로 자동 인증
      const data = await apiGet(`/api/adminPage/?page=${page}`);

      const results = data.results ?? data;
      setPosts(results);

      if (data.count) {
        setTotalPages(Math.ceil(data.count / PAGE_SIZE));
        setTotalCount(data.count);
      }
    } catch (error) {
      console.error("포스트 불러오기 실패:", error);
      // fetchWithAuth가 이미 401/403 처리
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (postId: number) => {
    router.push(`/admin/post/edit/${postId}`);
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await apiDelete(`/api/post/${postId}/`);

      alert("삭제되었습니다.");
      fetchPosts(currentPage);
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/admin/logout/", {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
    window.location.href = "http://localhost:8000/admin/login/?next=/admin/";
  };

  if (authLoading || loading) {
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

  return (
    <div className="admin_layout">
      <aside className="admin_sidebar">
        <div className="logo_section">
          <h2>Daily Insight</h2>
          <p>관리자 페이지</p>
        </div>

        <nav className="admin_nav">
          <Link href={"/admin/post"}>포스트 관리</Link>
          <Link href={"/admin/category"}>카테고리 관리</Link>
        </nav>

        <button className="logout_btn" onClick={handleLogout}>
          로그아웃
        </button>
      </aside>

      <main className="admin_content">
        <div className="page_header">
          <h1>포스트 관리</h1>
          <div className="header_info">
            <span>총 {totalCount}개의 포스트</span>
            <button
              className="btn_primary"
              onClick={() => router.push("/admin/post/add")}
            >
              + 새 글 작성
            </button>
          </div>
        </div>

        <table className="posts_table">
          <thead>
            <tr>
              <th>ID</th>
              <th>제목</th>
              <th>카테고리</th>
              <th>작성일</th>
              <th>관리</th>
              <th>총 조회수</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  등록된 포스트가 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>
                    <a
                      href={`/post/${post.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3498db" }}
                    >
                      {post.title}
                    </a>
                  </td>
                  <td>{post.category.name}</td>
                  <td>
                    {post.created_at
                      ? new Date(post.created_at)
                          .toLocaleDateString("ko-KR")
                          .slice(0, -1)
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn_edit"
                      onClick={() => handleEdit(post.id)}
                    >
                      수정
                    </button>
                    <button
                      className="btn_delete"
                      onClick={() => handleDelete(post.id)}
                    >
                      삭제
                    </button>
                  </td>
                  <td>{post.visit_count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="pagination_btn"
            >
              이전
            </button>

            <span className="pagination_info">
              {currentPage}/{totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="pagination_btn"
            >
              다음
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
