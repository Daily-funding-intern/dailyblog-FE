"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePostForm } from "@/hooks/usePostForm";
import Editor from "@/components/Editor";
import ThumbnailUpload from "@/components/ThumbnailUpload";
import "./add-post.css";

export default function NewPost() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth({
    requireAuth: true,
  });

  const {
    categories,
    uploading,
    formData,
    editorContent,
    editorRef,
    updateFormData,
    setThumbnailUrl,
    setEditorContent,
    handleSubmit,
  } = usePostForm();

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

  if (authLoading) {
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
    <div className="new_post_page">
      <header>
        <h1>새 글 작성</h1>
        <div className="header_actions">
          <Link href={"/admin/post"}>
            <button className="btn_home">관리자 페이지</button>
          </Link>
          <button onClick={handleLogout} className="btn_logout">
            로그아웃
          </button>
        </div>
      </header>

      <div className="content_wrapper">
        <form onSubmit={handleSubmit}>
          {/* 썸네일 업로드 */}
          <ThumbnailUpload onUpload={setThumbnailUrl} />

          {/* 카테고리 */}
          <section className="form_section">
            <label>카테고리 *</label>
            <select
              value={formData.category_id}
              onChange={(e) => updateFormData("category_id", e.target.value)}
              required
            >
              <option value="">선택하세요</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </section>

          {/* 제목 */}
          <section className="form_section">
            <label>제목 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              placeholder="제목을 입력하세요"
              required
            />
          </section>

          {/* 부제목 */}
          <section className="form_section">
            <label>부제목 *</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => updateFormData("subtitle", e.target.value)}
              placeholder="부제목을 입력하세요"
              required
            />
          </section>

          {/* 본문 에디터 */}
          <section className="form_section">
            <label>본문 *</label>
            <Editor
              content={editorContent}
              onChange={setEditorContent}
              editorRef={editorRef}
            />
          </section>

          {/* 제출 */}
          <div className="form_actions">
            <button type="submit" disabled={uploading}>
              {uploading ? "등록 중..." : "글 등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
