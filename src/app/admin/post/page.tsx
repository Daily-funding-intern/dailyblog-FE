"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@/app/types";
import "../admin.css";

export default function AdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/post/?page=${page}`,
        {
          // credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push("/admin/login");
          return;
        }
        throw new Error("포스트 불러오기 실패");
      }

      const data = await response.json();
      const results = data.results ?? data;
      setPosts(results);

      if (data.count) {
        const pageSize = data.results?.length || 10;
        setTotalPages(Math.ceil(data.count / pageSize));
        setTotalCount(data.count);
      }
    } catch (error) {
      console.error("포스트 불러오기 실패:", error);
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
      const response = await fetch(
        `http://127.0.0.1:8000/api/post/${postId}/`,
        {
          method: "DELETE",
          // credentials: "include",
        }
      );

      if (response.ok) {
        alert("삭제되었습니다.");
        fetchPosts(currentPage);
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        // credentials: "include",
      });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
    router.push("/admin/login");
  };

  if (loading) {
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
          <a href="/admin" className="active">
            포스트 관리
          </a>
          <a href="/admin/post/add">새 글 작성</a>
          <a href="/admin/categories">카테고리 관리</a>
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
                  <td>{new Date().toLocaleDateString("ko-KR")}</td>
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
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지 네이션 */}
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
