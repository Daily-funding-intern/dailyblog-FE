export interface Category {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail: string;
  category: Category;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  subtitle?: string;
  description: string;
  thumbnail: string;
  category: Category;
}

export interface RecommendPost {
  id: number;
  title: string;
  thumbnail: string;
  category: Category;
}
