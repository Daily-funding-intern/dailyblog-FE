"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiGet } from "@/lib/api";

import PostHeader from "@/components/PostHeader";
import { Category, Post, RecommendPost } from "@/app/types";
import "./post-page.css";

export default function PostPage() {
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [recommendPosts, setRecommendPosts] = useState<RecommendPost[]>([]);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const postData: Post = await apiGet(`/api/post/${postId}/`);

        // ===== 🔍 디버깅 시작 =====
        console.log("=== API 응답 전체 ===");
        console.log(JSON.stringify(postData, null, 2));
        console.log("=== 개별 필드 확인 ===");
        console.log("title:", postData.title);
        console.log("subtitle:", postData.subtitle);
        console.log("thumbnail:", postData.thumbnail);
        console.log("category:", postData.category);
        console.log("===================");
        // ===== 🔍 디버깅 끝 =====

        setPost(postData);

        const recommendData: RecommendPost[] = await apiGet(
          `/api/post/recommend/?category_id=${postData.category.id}`
        );
        setRecommendPosts(recommendData);
      } catch (error) {
        console.error("포스트 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <main>
      <div className="dailyblog_post_wrapper">
        <PostHeader article={post} />
        <div className="body_div">
          <section className="article_content_wrap closed">
            <article
              className="content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></article>
            <div className="post_bottom_btn_wrap"></div>
          </section>
          <section className="dailian_wrap">
            <div className="black_cover"></div>
            <div className="text_cover">
              <div>
                <p>
                  우리는 매일 금융의 각을 넓혀가는 <br />
                  데일리언입니다.
                </p>
                <Link
                  href="https://linktr.ee/dailyfunding"
                  target="_blank"
                  rel="noreferrer"
                >
                  <u>데일리언과 함께하기 &gt;</u>
                </Link>
              </div>
            </div>
          </section>
          <section className="another_insight_wrap">
            <div className="another_insight_inner">
              <p className="title">또 다른 인사이트</p>
              <div className="insight_items_div">
                {recommendPosts.map((recommendPost) => (
                  <Link
                    key={recommendPost.id}
                    href={`/post/${recommendPost.id}`}
                  >
                    <div className="item">
                      <div
                        className="image_div"
                        style={{
                          backgroundImage: `url(${recommendPost.thumbnail})`,
                        }}
                      >
                        <div className="category_div">
                          <div className="black_back"></div>
                          <span>{recommendPost.category.name}</span>
                        </div>
                      </div>
                      <div className="info_div">
                        <p className="article_title">{recommendPost.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
