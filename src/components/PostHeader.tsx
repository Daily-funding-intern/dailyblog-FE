"use client";

import { useRouter } from "next/navigation";
import { Post } from "@/app/types";
import "./PostHeader.css";

interface PostHeaderProps {
  article: Post;
}

export default function PostHeader({ article }: PostHeaderProps) {
  const router = useRouter();

  console.log("=== PostHeader가 받은 article ===");
  console.log("title:", article.title);
  console.log("subtitle:", article.subtitle);
  console.log("thumbnail:", article.thumbnail);
  console.log("category:", article.category);
  console.log("===================");

  const handleCategoryClick = () => {
    router.push(`/category/${article.category.id}`);
  };

  return (
    <header>
      <div className="top_div">
        <img
          alt="이전 페이지로"
          src="/Img/back.png"
          onClick={() => router.back()}
        />
        <img
          alt="홈으로"
          src="/Img/home.png"
          onClick={() => router.push("/")}
        />
      </div>
      <div
        className="post_header_wrap"
        style={{ backgroundImage: `url(${article.thumbnail})` }}
      >
        <div className="black_cover"></div>
        <div className="post_head_cover">
          <div className="center_div">
            <p className="category_badge" onClick={handleCategoryClick}>
              {article.category.name}
            </p>
            <h1 className="title">{article.title}</h1>
            {article.subtitle && <p className="subtitle">{article.subtitle}</p>}
            {/* 디버깅용 - 나중에 삭제 */}
            {!article.subtitle && (
              <p style={{ color: "red" }}>⚠️ subtitle 없음</p>
            )}
            {!article.thumbnail && (
              <p style={{ color: "red" }}>⚠️ thumbnail 없음</p>
            )}
          </div>
          <div className="bottom_div">
            <img alt="데일리펀딩" src="/Img/dailyfunding.png"></img>
          </div>
        </div>
      </div>
    </header>
  );
}
