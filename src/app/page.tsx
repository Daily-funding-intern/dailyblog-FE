"use client";

import HomeHeader from "@/components/HomeHeader";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

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
  const [carouselArticles, setCarouselArticles] = useState<Article[]>([]);

  const fetchCarouselArticles = async () => {
    try {
      const response = await fetch("YOUR_DJANGO_API_URL?limit=15&offset=0");
      const data = await response.json();
      setCarouselArticles(data);
    } catch (error) {
      console.error("캐러셀 게시물 불러오기 실패: ", error);
    }
  };

  useEffect(() => {
    fetchCarouselArticles();
  }, []);

  return (
    <main>
      <HomeHeader />
      <div className="dailyblog_main_wrapper">
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
