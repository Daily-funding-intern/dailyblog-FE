"use client";

import HomeHeader from "@/components/HomeHeader";
import { use, useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: Category;
}

export default function Home() {
  const [loading, setLoading] = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 6;

  // 기사 목록 불러오기
  const fetchArticles = async (currentOffset: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `YOUR_DJANGO_API_URL?limit=${LIMIT}&offset=${currentOffset}`
      );
      const data = await response.json();

      if (currentOffset === 0) {
        setArticles(data);
      } else {
        setArticles((prev) => [...prev, ...data]);
      }

      setHasMore(data.legnth === LIMIT);
    } catch (error) {
      console.error("포스트 불러오기 실패: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(0);
  }, []);

  const handleLoadMore = () => {
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchArticles(nextOffset);
  };

  return (
    <main>
      <div className="dailyblog_main_wrapper">
        <HomeHeader />
        <section className="carousel_wrap"></section>
        <section className="articles_list_wrap">
          <div className="category_div"></div>
          <div className="articles_list_div">
            {articles.map((article) => (
              <div key={article.id} className="article_item">
                <a href={`/post?post_id=${article.id}`}>
                  <div className="picture_div">
                    <div
                      className="picture"
                      style={{ backgroundImage: `url("${article.thumbnail}")` }}
                    ></div>
                  </div>
                </a>
                <div className="info_div">
                  <div className="category_badge">{article.category.name}</div>
                  <a href={`/post?post_id=${article.id}`}>
                    <p id={`content${article.id}`} className="title">
                      {/* id 굳이 필요? */}
                      {article.title}
                    </p>
                  </a>
                  <p className="description">{article.description}</p>
                  <a href={`/post?post_id=${article.id}`}>
                    <p className="item_more_btn">MORE &gt;</p>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="more_btn_div">
              MORE
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="load_more_btn"
              >
                {loading ? "로딩 중..." : "더보기"}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
