"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Category, Post } from "@/app/types";
import "../../add/add-post.css";
import { apiGet, apiPut, apiUploadFile } from "@/lib/api";

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth({
    requireAuth: true,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialContent, setInitialContent] = useState(""); // 에디터 초기 내용

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    // description: "",
    category_id: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  // Tiptap 에디터 - 초기 내용과 함께 생성
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: initialContent, // 초기 내용 설정
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose focus:outline-none min-h-[400px] p-4",
      },
    },
  });

  // 에디터가 준비되면 내용 업데이트
  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchPost();
    }
  }, [postId, isAuthenticated]);

  const fetchCategories = async () => {
    try {
      const data = await apiGet("/api/category/");
      setCategories(data);
    } catch (error) {
      console.error("카테고리 불러오기 실패:", error);
    }
  };

  const fetchPost = async () => {
    try {
      const data: Post = await apiGet(`/api/post/${postId}/`);

      console.log("=== 불러온 데이터 확인 ===");
      console.log("전체 데이터:", data);
      console.log("title:", data.title);
      console.log("subtitle:", data.subtitle);
      console.log("description:", data.description);
      console.log("category:", data.category);
      console.log("content:", data.content);
      console.log("======================");

      // 폼 데이터 설정
      setFormData({
        title: data.title,
        subtitle: data.subtitle || "",
        // description: data.description,
        category_id: data.category.id.toString(),
      });

      // 에디터 초기 내용 설정
      setInitialContent(data.content);

      // 썸네일 설정
      setThumbnailUrl(data.thumbnail);
      setThumbnailPreview(data.thumbnail);
    } catch (error) {
      console.error("포스트 불러오기 실패:", error);
      alert("포스트를 불러올 수 없습니다.");
      router.push("/admin/post");
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnail(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const data = await apiUploadFile(file);
      setThumbnailUrl(data.file_url);
      console.log("썸네일 업로드 성공:", data.file_url);
    } catch (error) {
      console.error("썸네일 업로드 실패:", error);
      alert("썸네일 업로드 중 오류가 발생했습니다.");
    }
  };

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file || !editor) return;

      try {
        const data = await apiUploadFile(file);
        editor.chain().focus().setImage({ src: data.file_url }).run();
        console.log("이미지 업로드 성공:", data.file_url);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드 중 오류가 발생했습니다.");
      }
    };

    input.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editor) {
      alert("에디터 로딩 중입니다.");
      return;
    }

    setUploading(true);

    const postData = {
      title: formData.title,
      subtitle: formData.subtitle,
      // description: formData.description,
      content: editor.getHTML(),
      category: parseInt(formData.category_id),
      is_featured: true,
      thumbnail: thumbnailUrl,
    };

    console.log("=== 전송할 데이터 확인 ===");
    console.log(postData);
    console.log("======================");

    try {
      const data = await apiPut(`/api/post/${postId}/`, postData);

      alert("글이 수정되었습니다.");
      console.log("수정된 포스트:", data);
      router.push(`/post/${postId}`);
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정에 실패했습니다.");
    } finally {
      setUploading(false);
    }
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
          {/* 썸네일 */}
          <section className="form_section">
            <label>썸네일 이미지 *</label>
            {thumbnailPreview ? (
              <div className="thumbnail_preview">
                <img src={thumbnailPreview} alt="미리보기" />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e: any) =>
                      handleThumbnailChange(e as any);
                    input.click();
                  }}
                >
                  변경
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
            <small style={{ color: "#666", marginTop: "5px" }}>
              현재 선택: {formData.category_id}
            </small>
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
            <label>부제목 *</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              placeholder="부제목을 입력하세요"
              required
            />
          </section>

          {/* 본문 */}
          <section className="form_section">
            <label>본문 *</label>

            <div className="editor_toolbar">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={editor?.isActive("bold") ? "is_active" : ""}
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={editor?.isActive("italic") ? "is_active" : ""}
              >
                <em>I</em>
              </button>
              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                  editor?.isActive("heading", { level: 2 }) ? "is_active" : ""
                }
              >
                H2
              </button>
              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={
                  editor?.isActive("heading", { level: 3 }) ? "is_active" : ""
                }
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={editor?.isActive("bulletList") ? "is_active" : ""}
              >
                • 목록
              </button>
              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                className={editor?.isActive("orderedList") ? "is_active" : ""}
              >
                1. 목록
              </button>
              <button type="button" onClick={addImage}>
                🖼️ 이미지
              </button>
            </div>

            <div className="editor_content">
              <EditorContent editor={editor} />
            </div>
          </section>

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
