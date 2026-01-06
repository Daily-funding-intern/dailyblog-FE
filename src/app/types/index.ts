export interface Category {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail: string;
  category: Category;
  created_at?: Date;
  visit_count: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  subtitle: string;
  description?: string;
  thumbnail: string;
  category: Category;
  is_featured: boolean;
}

export interface RecommendPost {
  id: number;
  title: string;
  thumbnail: string;
  category: Category;
}
