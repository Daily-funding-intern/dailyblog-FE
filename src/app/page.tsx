"use client";

import { useState, useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import HomeHeader from "@/components/HomeHeader";
import "./home-page.css";

interface Category {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail: string;
  category: Category;
}

export default function Home() {
  const [loading, setLoading] = useState(false);

  const [carouselArticles, setCarouselArticles] = useState<Article[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCateory] = useState<number | null>(null);

  const [articles, setArticles] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 캐러셀 불러오기
  const fetchCarouselArticles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/post/featured/");
      const data = await response.json();
      setCarouselArticles(data);
    } catch (error) {
      console.error("캐러셀 게시물 불러오기 실패: ", error);
    }
  };

  // 카테고리 목록 불러오기
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/category/");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("카테고리 불러오기 실패: ", error);
    }
  };

  // 기사 목록 불러오기
  const fetchArticles = async (
    page: number,
    categoryId: number | null = null
  ) => {
    setLoading(true);
    try {
      const categoryParam = categoryId ? `&category_id=${categoryId}` : "";
      const response = await fetch(
        `http://127.0.0.1:8000/api/post/?page=${page}${categoryParam}`
      );
      const data = await response.json();
      const results = data.results ?? [];

      if (page === 1) {
        setArticles(results);
      } else {
        setArticles((prev) => [...prev, ...results]);
      }

      setHasMore(!!data.next);
    } catch (error) {
      console.error("포스트 불러오기 실패: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarouselArticles();
    fetchCategories();
    fetchArticles(1);
  }, []);

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCateory(categoryId);
    setCurrentPage(1);
    fetchArticles(1, categoryId);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchArticles(nextPage, selectedCategory);
  };

  return (
    <main>
      <div className="dailyblog_main_wrapper">
        <img
          className="to_top_btn"
          alt="맨 위로 올라가기"
          src="/Img/to_top.png"
        />
        <HomeHeader />
        <section className="carousel_wrap">
          {carouselArticles.length > 0 && (
            <AliceCarousel
              mouseTracking
              items={carouselArticles.map((article) => (
                <div
                  key={article.id}
                  className="carousel_item"
                  style={{ backgroundImage: `url("${article.thumbnail}")` }}
                >
                  <div className="black_cover"></div>
                  <div className="carousel_cover">
                    <div className="center_div">
                      <p className="category_badge">{article.category.name}</p>
                      <a href={`/post/${article.id}`}>
                        <p className="title">{article.title}</p>
                      </a>
                      <p className="subtitle">{article.subtitle}</p>
                    </div>
                    <div className="bottom_div"></div>
                  </div>
                </div>
              ))}
              infinite
              disableButtonsControls={true}
              disableDotsControls={false}
            />
          )}
        </section>
        <section className="articles_list_wrap">
          <div className="category_div">
            <div
              className={`categort_badge ${
                selectedCategory === null ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(null)}
            >
              전체보기
            </div>
            {categories.map((category) => (
              <div
                key={category.id}
                className={`categort_badge ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </div>
            ))}
          </div>
          <div className="articles_list_div">
            {articles.map((article) => (
              <div key={article.id} className="article_item">
                <a href={`/post/${article.id}`}>
                  <div className="picture_div">
                    <div
                      className="picture"
                      style={{ backgroundImage: `url("${article.thumbnail}")` }}
                    ></div>
                  </div>
                </a>
                <div className="info_div">
                  <div className="category_badge">{article.category.name}</div>
                  <a href={`/post/${article.id}`}>
                    <p id={`content${article.id}`} className="title">
                      {/* id 굳이 필요? */}
                      {article.title}
                    </p>
                  </a>
                  <p className="description">{article.description}</p>
                  <a href={`/post/${article.id}`}>
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
