"use clinet";

import { useState } from "react";
import { apiUploadFile } from "@/lib/api";

interface ThumbnailUploadProps {
  onUpload: (url: string) => void;
  initialPreview?: string;
}

export default function ThumbnailUpload({
  onUpload,
  initialPreview = "",
}: ThumbnailUploadProps) {
  const [preview, setPreview] = useState<string>(initialPreview);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 미리보기 설정
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // S3 업로드
    setUploading(true);
    try {
      const data = await apiUploadFile(file);
      onUpload(data.file_url);
      console.log("썸네일 업로드 성공:", data.file_url);
    } catch (error) {
      console.error("썸네일 업로드 실패:", error);
      alert("썸네일 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => handleFileChange(e);
    input.click();
  };

  return (
    <section className="form_section">
      <label>썸네일 이미지 *</label>
      {preview ? (
        <div className="thumbnail_preview">
          <img src={preview} alt="미리보기" />
          <button type="button" onClick={handleChange} disabled={uploading}>
            {uploading ? "업로드 중..." : "변경"}
          </button>
        </div>
      ) : (
        <label className="thumbnail_upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
          <div className="upload_placeholder">
            <span>+ 이미지 업로드</span>
          </div>
        </label>
      )}
    </section>
  );
}
