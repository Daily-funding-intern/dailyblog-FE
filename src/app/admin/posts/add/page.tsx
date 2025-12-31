"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Category } from "@/app/types";
import "./add-post.css";
import { read } from "fs";

export default function NewPost() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category_id: "",
    // is_featured: true,
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(""); // S3 URL 저장

  // Tiptap 에디터 설정
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[400px] p-4",
      },
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/category/", {
        // credentials: "include", // 세션 쿠키 포함
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("카테고리 불러오기 실패:", error);
    }
  };

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 미리보기용 로컬 URL
    setThumbnail(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/api/uploadfile/", {
        method: "POST",
        // credentials: "include", // 세션 쿠키 포함
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setThumbnailUrl(data.file_url); // S3 URL 저장
        console.log("썸네일 업로드 성공:", data.file_url);
      } else {
        alert("썸네일 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("썸네일 업로드 실패:", error);
      alert("썸네일 업로드 중 오류가 발생했습니다.");
    }
  };

  //   에디터 이미지 추가
  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file || !editor) return;

      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("http://127.0.0.1:8000/api/uploadfile/", {
          method: "POST",
          //   credentials: "include",
          body: uploadFormData,
        });

        if (response.ok) {
          const data = await response.json();
          // 임시 URL을 에디터에 삽입
          editor.chain().focus().setImage({ src: data.file_url }).run();
          console.log("이미지 업로드 성공:", data.file_url);
        } else if (response.status === 401 || response.status === 403) {
          alert("로그인이 필요합니다.");
          router.push("/admin/login");
        } else {
          alert("이미지 업로드에 실패했습니다.");
        }
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드 중 오류가 발생했습니다.");
      }
    };

    input.click();
  };

  const handleLogout = async () => {
    try {
      // 장고 로그아웃 API..
      await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }

    // 로그인 페이지로 이동
    router.push("/admin/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!thumbnail) {
      alert("썸네일 이미지를 선택해 주세요.");
      return;
    }

    if (!editor) {
      alert("에디터 로딩 중입니다.");
      return;
    }

    setUploading(true);

    // JSON 형식으로 포스트 생성 요청
    const postData = {
      title: formData.title,
      subtitle: formData.subtitle,
      content: editor.getHTML(),
      category: parseInt(formData.category_id),
      is_featured: true,
      thumbnail: thumbnailUrl,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/post-create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include", // 세션 쿠키 포함
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("글이 등록되었습니다.");
        console.log("생성된 포스트:", data);
        router.push(`/`);
      } else if (response.status === 401 || response.status === 403) {
        alert("로그인이 필요합니다.");
        router.push("/admin/login");
      } else {
        const errorData = await response.json();
        console.error("등록 실패:", errorData);
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
      <header>
        <h1>새 글 작성</h1>
        <div className="header_actions">
          <button onClick={() => router.push("/")} className="btn_home">
            홈으로
          </button>
          {/* <button onClick={handleLogout} className="btn_logout">
            로그아웃
          </button> */}
        </div>
      </header>

      <div className="content_wrapper">
        <form onSubmit={handleSubmit}>
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
                  {/* 권장 크기? */}
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
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
              }}
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
              onChange={(e) => {
                setFormData({ ...formData, subtitle: e.target.value });
              }}
              placeholder="부제목을 입력하세요"
              required
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

          {/* 본문(tiptap) */}
          <section className="form_section">
            <label>본문 *</label>

            {/* 에디터 툴바 */}
            <div className="editor_toolbar">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={editor?.isActive("bold") ? "is_active" : ""}
              >
                {" "}
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
                className={editor?.isActive("orderList") ? "is_active" : ""}
              >
                1. 목록
              </button>
              <button type="button" onClick={addImage}>
                🖼️ 이미지
              </button>
            </div>

            {/* 에디터 */}
            <div className="editor_content">
              <EditorContent editor={editor} />
            </div>
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
