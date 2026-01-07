"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import HomeHeader from "@/components/HomeHeader";
import { Category, Article } from "./types";
import "./home-page.css";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  const categoryId = pathname.startsWith("/category/")
    ? Number(pathname.split("/")[2])
    : null;

  const [loading, setLoading] = useState(false);
  const [carouselArticles, setCarouselArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const articlesRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<AliceCarousel>(null); // 라이브러리...?

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToArticles = () => {
    articlesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const fetchCarouselArticles = async () => {
    try {
      const data = await apiGet(`/api/post/featured/`);

      console.log("캐러셀 응답 데이터:", data); // 응답 확인
      console.log("캐러셀 개수:", data.length); // 개수 확인

      setCarouselArticles(data.slice(0, 15));
    } catch (error) {
      console.error("캐러셀 게시물 불러오기 실패: ", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiGet("/api/category/");
      setCategories(data);
    } catch (error) {
      console.error("카테고리 불러오기 실패: ", error);
    }
  };

  const fetchArticles = async (
    page: number,
    categoryId: number | null = null
  ) => {
    setLoading(true);
    try {
      const categoryParam = categoryId ? `&category_id=${categoryId}` : "";
      const data = await apiGet(`/api/post/?page=${page}${categoryParam}`);
      const results = data.results ?? [];

      setArticles((prev) => (page === 1 ? results : [...prev, ...results]));
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
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchArticles(1, categoryId);

    const scrollTimer = setTimeout(() => {
      scrollToArticles();
    }, 100);
    return () => clearTimeout(scrollTimer);
  }, [categoryId]);

  const handleCategoryClick = (selectedCategoryId: number | null) => {
    const newPath =
      selectedCategoryId === null ? "/" : `/category/${selectedCategoryId}`;

    router.push(newPath, { scroll: false });
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchArticles(nextPage, categoryId);
  };

  return (
    <main>
      <div className="dailyblog_main_wrapper">
        <img
          className="to_top_btn"
          alt="맨 위로 올라가기"
          src="/Img/to_top.png"
          onClick={scrollToTop}
        />
        <HomeHeader />
        <section className="carousel_wrap">
          {carouselArticles.length > 0 && (
            <AliceCarousel
              ref={carouselRef}
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
                      <p
                        className="category_badge"
                        onClick={() => handleCategoryClick(article.category.id)}
                      >
                        {article.category.name}
                      </p>
                      <Link href={`/post/${article.id}`}>
                        <p className="title">{article.title}</p>
                      </Link>
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
          <button
            className="carousel_left_btn"
            onClick={() => carouselRef.current?.slidePrev()}
          >
            <img src="/Img/left.png" />
          </button>
          <button
            className="carousel_right_btn"
            onClick={() => carouselRef.current?.slideNext()}
          >
            {" "}
            <img src="/Img/right.png" />
          </button>
        </section>
        <section className="articles_list_wrap" ref={articlesRef}>
          <div className="category_div">
            <div
              className={`category_badge ${
                categoryId === null ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(null)}
            >
              전체보기
            </div>
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category_badge ${
                  categoryId === category.id ? "active" : ""
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
                <Link href={`/post/${article.id}`}>
                  <div className="picture_div">
                    <div
                      className="picture"
                      style={{ backgroundImage: `url("${article.thumbnail}")` }}
                    ></div>
                  </div>
                </Link>
                <div className="info_div">
                  <div className="category_badge">{article.category.name}</div>
                  <Link href={`/post/${article.id}`}>
                    <p className="title">{article.title}</p>
                  </Link>
                  <p className="description">{article.description}</p>
                  <Link href={`/post/${article.id}`}>
                    <p className="item_more_btn">MORE &gt;</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="more_btn_div" onClick={handleLoadMore}>
              <p>MORE</p>
              <img alt="더보기" src="/Img/more.png"></img>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
