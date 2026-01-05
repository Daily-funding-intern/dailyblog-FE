"use client";

import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";
import { apiUploadFile } from "@/lib/api";
import "./Editor.css";

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  editorRef?: React.MutableRefObject<Editor | null>;
}

export default function RichTextEditor({
  content = "",
  onChange,
  editorRef,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Underline, // 밑줄 확장
      Highlight.configure({
        multicolor: true, // 여러 색상 지원
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose focus:outline-none min-h-[400px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // 외부에서 editor 인스턴스에 접근할 수 있도록
  useEffect(() => {
    if (editorRef && editor) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  // content prop이 변경되면 에디터 내용 업데이트
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

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

  if (!editor) {
    return <div>에디터 로딩 중...</div>;
  }

  return (
    <div>
      <div className="editor_toolbar">
        {/* 기본 서식 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is_active" : ""}
          title="굵게 (Ctrl+B)"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is_active" : ""}
          title="기울임 (Ctrl+I)"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is_active" : ""}
          title="밑줄 (Ctrl+U)"
        >
          <u>U</u>
        </button>

        {/* 형광펜 색상 */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()
          }
          className={
            editor.isActive("highlight", { color: "#fef08a" })
              ? "is_active"
              : ""
          }
          title="노란색 형광펜"
          style={{ backgroundColor: "#fef08a" }}
        >
          <span style={{ mixBlendMode: "darken" }}>노랑</span>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#bbf7d0" }).run()
          }
          className={
            editor.isActive("highlight", { color: "#bbf7d0" })
              ? "is_active"
              : ""
          }
          title="초록색 형광펜"
          style={{ backgroundColor: "#bbf7d0" }}
        >
          <span style={{ mixBlendMode: "darken" }}>초록</span>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#bfdbfe" }).run()
          }
          className={
            editor.isActive("highlight", { color: "#bfdbfe" })
              ? "is_active"
              : ""
          }
          title="파란색 형광펜"
          style={{ backgroundColor: "#bfdbfe" }}
        >
          <span style={{ mixBlendMode: "darken" }}>파랑</span>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#fecaca" }).run()
          }
          className={
            editor.isActive("highlight", { color: "#fecaca" })
              ? "is_active"
              : ""
          }
          title="빨간색 형광펜"
          style={{ backgroundColor: "#fecaca" }}
        >
          <span style={{ mixBlendMode: "darken" }}>빨강</span>
        </button>

        {/* 제목 */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is_active" : ""
          }
          title="제목 2"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is_active" : ""
          }
          title="제목 3"
        >
          H3
        </button>

        {/* 목록 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is_active" : ""}
          title="글머리 기호 목록"
        >
          • 목록
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is_active" : ""}
          title="번호 매기기 목록"
        >
          1. 목록
        </button>

        {/* 이미지 */}
        <button type="button" onClick={addImage} title="이미지 삽입">
          🖼️ 이미지
        </button>
      </div>

      <div className="editor_content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
