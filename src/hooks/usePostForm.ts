import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@tiptap/react";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import { Category, Post } from "@/app/types";

interface UsePostFormOptions {
  postId?: string;
  isEditMode?: boolean;
}

export function usePostForm({
  postId,
  isEditMode = false,
}: UsePostFormOptions = {}) {
  const router = useRouter();
  const editorRef = useRef<Editor | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEditMode);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category_id: "",
  });

  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>("");

  // 카테고리 목록 불러오기
  useEffect(() => {
    fetchCategories();
  }, []);

  // 수정 모드일 경우 포스트 데이터 불러오기
  useEffect(() => {
    if (isEditMode && postId) {
      fetchPost();
    }
  }, [isEditMode, postId]);

  const fetchCategories = async () => {
    try {
      const data = await apiGet("/api/category/");
      setCategories(data);
    } catch (error) {
      console.error("카테고리 불러오기 실패:", error);
    }
  };

  const fetchPost = async () => {
    if (!postId) return;

    try {
      const data: Post = await apiGet(`/api/post/${postId}/`);

      setFormData({
        title: data.title,
        subtitle: data.subtitle || "",
        category_id: data.category.id.toString(),
      });

      setEditorContent(data.content);
      setThumbnailUrl(data.thumbnail);
    } catch (error) {
      console.error("포스트 불러오기 실패:", error);
      alert("포스트를 불러올 수 없습니다.");
      router.push("/admin/post");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editorRef.current) {
      alert("에디터 로딩 중입니다.");
      return;
    }

    if (!thumbnailUrl) {
      alert("썸네일 이미지를 업로드해 주세요.");
      return;
    }

    setUploading(true);

    const postData = {
      title: formData.title,
      subtitle: formData.subtitle,
      content: editorRef.current.getHTML(),
      category: parseInt(formData.category_id),
      is_featured: true,
      thumbnail: thumbnailUrl,
    };

    try {
      if (isEditMode && postId) {
        await apiPatch(`/api/post/${postId}/`, postData);
        alert("글이 수정되었습니다.");
        router.push(`/post/${postId}`);
      } else {
        const data = await apiPost("/api/post-create/", postData);
        alert("글이 등록되었습니다.");
        router.push(`/admin/post/`);
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert(`${isEditMode ? "수정" : "등록"}에 실패했습니다.`);
    } finally {
      setUploading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    // State
    categories,
    loading,
    uploading,
    formData,
    thumbnailUrl,
    editorContent,
    editorRef,

    // Actions
    updateFormData,
    setThumbnailUrl,
    setEditorContent,
    handleSubmit,
  };
}
