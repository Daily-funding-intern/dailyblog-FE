"use client";

import "./PostHeader.css";

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

interface PostHeaderProps {
  article: Article;
}

export default function PostHeader({ article }: PostHeaderProps) {
  return (
    <header>
      <div className="top_div">
        <img
          alt="이전 페이지로"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAABNCAYAAADQMva5AAAAAXNSR0IArs4c6QAAAbFJREFUaAXtmr1KxEAURjeKYOmyYCHCFhY26hP4TpaWPo61hViJL7GCCIpgIQiCLyDxjEFYJjsTbjYjN/JduGEzfzk5uZk0O5k4jLquj8lbcuoQr0EC7oj8IEMsyJk7WKBOyF9Ifv7EI8dtN7DALJtsEJvjmSAtBmTSYis3ViZzdix9mDwk4y2IptrV2x0g3wNVFIK0PO0J9mTSZCw1WCZTZqztMmk1lho/FpMHgLrfzAPkGxmHqy/OqCHPU3X85+0845RJQZqehkyadGUGj8XkHNBV+6SrFydAvpJxCDJTge0u9M1JmWyrMbbIpFFYcrhMJtUYO0ZhMtwToHdkHAvj/ZYfDuE++RyTcn5d/urGKwC1R76sgL2hbcu4XNnhgi3lV2ZlFgMqg8Jl8IThOFzus7tQCnbwasCqzA5uNSwos0W0dpvdLHXdXutmyuCKPpewD4DF4RJ2BqVge9VlbhJWZTYnqHefzPZW1zFRZjsE9e4eo9nwT9s4XH7BdqAUbO/aTE3Eqsym5KzV/q/MbqylYsDJVVV9stwpeR8t+xWd+ziNyuCSczcyW4aAm5IXyx3fhWwL1J8tbO0AAAAASUVORK5CYII="
        />
        <img
          alt="홈으로"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAYAAADHl1ErAAAAAXNSR0IArs4c6QAAAlVJREFUeAHt3DtOw0AQBuAERaLiHhQcgBbR0CLlEFwBCQnOQwEtR+EGUEEJUojMv44n2Rg7wvY+5rErjXZ3HMfxp3HSjDKbYVRVtUA8IpZuX8ZOACYPLrYZbI4RTwg3VoiC1ujAwmHR2KBh90wZbzaPBot7z4OWt+5xvEJ8UaaZTVcaDPzKIpo3LE7r4sOioHU/hn+xmteVSgMEdA5XFmHRbLnSBmNZRhuNZRFtMpYltGBYFtCCY2lGi4alES06lia0ZFga0JJjSUbLhiURLTuWJDQ2WBLQ2GFxRmOLxRGNPRYnNDFYHNDEYeVEE4uVA008Vko0NVgp0NRhxURTixUDTT1WSDQzWCHQzGFNQTOLNQbNPNYQtIJFWs0MkN6uoYLVwqJtD9oa+fbY9WfRyVZnyHRVmg9WsNrF0aC5zsf2+ERi0/nXPinD/ijDNfsueY4Di46DJ8iddeTtplBBXZ1/fqWZ7rndq4werA/kv30xrAtaD1b9BY9jXT8EdtEOYVEJFrRG4j9YBW0Elnm0IZVFWDSbezynYJlDC4FlBi0klnq0GFhq0WJiqUNLgaUGLSWWeLQcWGLRcmKJQ+OAJQaNExZ7NI5YbNE4Y7FDk4DFBk0SVnY0iVjZ0CRjJUfTgJUMTRNWdDSNWNHQNGMFR7OAFQzNEtZkNItYo9EsYw1GK1hEVv9L3eGuoYK1w6IVTHrRulo233HixXw+f6U3sDbj3l9wz9eIH+/e11iv6j1E7xBulG5lTwgeS4Rr4nPdkJfeofrZvUGSTbfy3ofLuIGJQ9ti/QIuiZPLeH6a7gAAAABJRU5ErkJggg=="
        />
      </div>
      <div
        className="post_header_wrap"
        style={{ backgroundImage: `url(${article.thumbnail})` }}
      >
        <div className="black_cover"></div>
        <div className="post_head_cover">
          <div className="center_div">
            <p className="category">{article.category.name}</p>
            <h1 className="title">{article.title}</h1>
            {article.subtitle && <p className="subtitle">{article.subtitle}</p>}
          </div>
          <div className="bottom_div">
            <img
              alt="데일리펀딩"
              src="data:image/png;base64,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"
            ></img>
          </div>
        </div>
      </div>
    </header>
  );
}
