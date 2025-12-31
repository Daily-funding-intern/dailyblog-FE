"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/app/types";
import "./add-post.css";

export default function NewPost() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    content: "",
    category_id: "",
    is_featured: false,
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  useEffect(() => {
    // const token = localStorage.getItem("admin_token");
    // if (!token) {
    //   router.push("/admin/login");
    //   return;
    // }

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/category/");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("카테고리 불러오기 실패:", error);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!thumbnail) {
      alert("썸네일 이미지를 선택해주세요.");
      return;
    }

    setUploading(true);
    const token = localStorage.getItem("admin_token");
    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title);
    formDataToSend.append("subtitle", formData.subtitle);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("category", formData.category_id);
    formDataToSend.append("is_featured", formData.is_featured.toString());
    formDataToSend.append("thumbnail", thumbnail);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/post/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        alert("글이 등록되었습니다.");
        router.push(`/post/${data.id}`);
      } else {
        const errorData = await response.json();
        alert(`등록 실패: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="new_post_page">
      {/* 상단 헤더 */}
      <header className="admin_header">
        <h1>새 글 작성</h1>
        <div className="header_actions">
          <button onClick={() => router.push("/")} className="btn_home">
            홈으로
          </button>
          <button onClick={handleLogout} className="btn_logout">
            로그아웃
          </button>
        </div>
      </header>

      {/* 본문 */}
      <div className="content_wrapper">
        <form onSubmit={handleSubmit}>
          {/* 썸네일 */}
          <section className="form_section">
            <label>썸네일 이미지 *</label>
            {thumbnailPreview ? (
              <div className="thumbnail_preview">
                <img src={thumbnailPreview} alt="미리보기" />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnail(null);
                    setThumbnailPreview("");
                  }}
                >
                  삭제
                </button>
              </div>
            ) : (
              <label className="thumbnail_upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  hidden
                />
                <div className="upload_placeholder">
                  <span>+ 이미지 업로드</span>
                  <small>권장 크기: 1200x675px</small>
                </div>
              </label>
            )}
          </section>

          {/* 카테고리 */}
          <section className="form_section">
            <label>카테고리 *</label>
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="제목을 입력하세요"
              required
            />
          </section>

          {/* 부제목 */}
          <section className="form_section">
            <label>부제목</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              placeholder="부제목을 입력하세요 (선택)"
            />
          </section>

          {/* 요약 */}
          <section className="form_section">
            <label>요약 *</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="목록에 표시될 요약을 입력하세요"
              rows={3}
              required
            />
          </section>

          {/* 본문 */}
          <section className="form_section">
            <label>본문 *</label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="HTML 태그를 사용할 수 있습니다"
              rows={20}
              required
            />
            <small>
              예: &lt;h2&gt;제목&lt;/h2&gt;, &lt;p&gt;내용&lt;/p&gt;
            </small>
          </section>

          {/* 캐러셀 노출 */}
          <section className="form_section">
            <label className="checkbox_label">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData({ ...formData, is_featured: e.target.checked })
                }
              />
              <span>메인 캐러셀에 노출</span>
            </label>
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
