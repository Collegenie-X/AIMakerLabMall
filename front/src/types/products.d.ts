// 상품 관련 타입 정의

// 상품 카테고리 타입
export type ProductCategory = 
  | '로봇' 
  | '코딩' 
  | '인공지능' 
  | '교육키트' 
  | '액세서리';

// 상품 타입
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  images: string[];
  category: ProductCategory;
  stock: number;
  isNew: boolean;
  isBestseller: boolean;
  createdAt: string;
  updatedAt: string;
}

// 상품 리스트 필터 타입
export interface ProductFilter {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'bestseller';
  search?: string;
  page: number;
  limit: number;
}

// 상품 목록 응답 타입
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 