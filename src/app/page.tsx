"use client";

import { useState, useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import HomeHeader from "@/components/HomeHeader";

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
  const [offset, setOffset] = useState(0);
  const LIMIT = 6;
  
  // 캐러셀 불러오기
  const fetchCarouselArticles = async () => {
    try {
      const response = await fetch("YOUR_DJANGO_API_URL?limit=15&offset=0");
      const data = await response.json();
      setCarouselArticles(data);
    } catch (error) {
      console.error("캐러셀 게시물 불러오기 실패: ", error);

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
    currentOffset: number,
    categortId: number | null = null
  ) => {
    setLoading(true);
    try {
      const categoryParam = categortId ? `&category_id=${categortId}` : "";
      const response = await fetch(`http://127.0.0.1:8000/api/post/`);
      const data = await response.json();
      const results = data.results ?? [];

      if (currentOffset === 0) {
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
    fetchArticles(0);
  }, []);

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCateory(categoryId);
    setOffset(0); // offset 초기화 (해당 카테고리 게시글로 다시 로딩)
    fetchArticles(0, categoryId);
  };

  const handleLoadMore = () => {
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchArticles(nextOffset);
  };

  return (
    <main>
      <div className="dailyblog_main_wrapper">
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
                      <a href={`/post?post_id=${article.id}`}>
                        <p className="title">{article.title}</p>
                      </a>
                      <p className="subtitle">{article.subtitle}</p>
                    </div>
                    <div className="bottom_div"></div>
                  </div>
                </div>
              ))}
              autoPlay
              autoPlayInterval={3000}
              infinite
              disableButtonsControls={true}
              disableDotsControls={false}
            />
          )}
        </section>
        <section className="articles_list_wrap">
          <div className="category_div"></div>
          <div className="articles_list_div"></div>
        </section>
      </div>
    </main>
  );
}
