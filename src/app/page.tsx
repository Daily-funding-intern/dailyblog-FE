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
  return (
    <main>
      <div className="dailyblog_main_wrapper">
        <section className="carousel_wrap"></section>
        <section className="articles_list_wrap">
          <div className="category_div"></div>
          <div className="articles_list_div"></div>
        </section>
      </div>
    </main>
  );
}
