"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePostForm } from "@/hooks/usePostForm";
import Editor from "@/components/Editor";
import ThumbnailUpload from "@/components/ThumbnailUpload";
import "../../add/add-post.css";

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const { isAuthenticated, isLoading: authLoading } = useAuth({
    requireAuth: true,
  });

  const {
    categories,
    loading,
    uploading,
    formData,
    thumbnailUrl,
    editorContent,
    editorRef,
    updateFormData,
    setThumbnailUrl,
    setEditorContent,
    handleSubmit,

    isFeatured,
    setIsFeatured,
  } = usePostForm({ postId, isEditMode: true });

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
    <div className="new_post_page">
      <header>
        <h1>글 수정 (ID: {postId})</h1>
        <div className="header_actions">
          <button
            onClick={() => router.push("/admin/post")}
            className="btn_home"
          >
            관리자 페이지
          </button>
        </div>
      </header>

      <div className="content_wrapper">
        <form onSubmit={handleSubmit}>
          {/* 썸네일 업로드 */}
          <ThumbnailUpload
            onUpload={setThumbnailUrl}
            initialPreview={thumbnailUrl}
          />

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

          <label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    checked={isFeatured}
    onChange={(e) => setIsFeatured(e.target.checked)}
    style={{ appearance: "auto" }}   
  />
  <span>공개</span>
</label>

          {/* 제출 */}
          <div className="form_actions">
            <button
              type="button"
              onClick={() => router.back()}
              style={{ backgroundColor: "#ccc", color: "#333" }}
            >
              취소
            </button>
            <button type="submit" disabled={uploading}>
              {uploading ? "수정 중..." : "글 수정"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
