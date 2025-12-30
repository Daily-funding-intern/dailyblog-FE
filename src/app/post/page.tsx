"use client";

import PostHeader from "@/components/PostHeader";

export default function Post() {
  return (
    <main>
      <div className="dailyblog_post_wrapper">
        <PostHeader />
        <div className="body_div">
          <section className="article_content_wrap closed">
            <article className="content"></article> {/* 받아오기 */}
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
          <section className="another_insight_wrap"></section>
        </div>
      </div>
    </main>
  );
}
