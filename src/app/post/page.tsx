"use client";

import PostHeader from "@/components/PostHeader";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./post-page.css";

interface Category {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category: Category;
  description: string;
  thumbnail: string;
}

interface RecommendPost {
  id: number;
  title: string;
  thumbnail: string;
  category: Category;
}

export default function Post() {
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const postId = searchParams.get("post_id");

  const [post, setPost] = useState<Post | null>(null);
  const [recommendPosts, setRecommendPosts] = useState<RecommendPost[]>([]);

  useEffect(() => {
    if (!postId) return;

    // 포스트 데이터 가져오기
    const fetchPost = async () => {
      try {
        const postResponse = await fetch(
          `http://127.0.0.1:8000/api/post/${postId}/`
        );
        const postData: Post = await postResponse.json();
        setPost(postData);

        // 추천 포스트 가져오기
        const recommendResponse = await fetch(
          `http://127.0.0.1:8000/api/post/recommend/?category_id=${postData.category.id}`
        );
        const recommendData: RecommendPost[] = await recommendResponse.json();
        setRecommendPosts(recommendData);
      } catch (error) {
        console.error("Failed to fetch post:", error);
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
                <a
                  href="https://linktr.ee/dailyfunding"
                  target="_blank"
                  rel="noreferrer"
                >
                  <u>데일리언과 함께하기 &gt;</u>
                </a>
              </div>
            </div>
          </section>
          <section className="another_insight_wrap">
            {recommendPosts.map((recommendPost) => (
              <a
                key={recommendPost.id}
                href={`/post?post_id=${recommendPost.id}`}
                className="insight_item"
              >
                <div
                  className="thumbnail"
                  style={{ backgroundImage: `url(${recommendPost.thumbnail})` }}
                ></div>
                <div className="info">
                  <p className="category">{recommendPost.category.name}</p>
                  <p className="title">{recommendPost.title}</p>
                </div>
              </a>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
