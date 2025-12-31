"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import HomeHeader from "@/components/HomeHeader";
import { Category, Article } from "./types";
import "./home-page.css";

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id ? Number(params.id) : null;

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
      const categoryParam = categoryId ? `?category_id=${categoryId}` : "";
      const response = await fetch(
        `http://127.0.0.1:8000/api/post/featured/${categoryParam}`
      );
      const data = await response.json();
      console.log("캐러셀 응답 데이터:", data); // 응답 확인
      console.log("캐러셀 개수:", data.length); // 개수 확인

      setCarouselArticles(data.slice(0, 15));
    } catch (error) {
      console.error("캐러셀 게시물 불러오기 실패: ", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/category/");
      const data = await response.json();
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
  }, []);

  useEffect(() => {
    fetchCarouselArticles();
    setCurrentPage(1);
    fetchArticles(1, categoryId);
    setTimeout(() => {
      if (articlesRef.current) {
        const articleTop = articlesRef.current.offsetTop;

        if (window.scrollY !== articleTop) {
          scrollToArticles();
        }
      }
    }, 100);
  }, [categoryId]);

  const handleCategoryClick = (selectedCategoryId: number | null) => {
    if (selectedCategoryId === null) {
      router.push("/");
    } else {
      router.push(`/category/${selectedCategoryId}`);
    }
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
                    <p className="title">{article.title}</p>
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
