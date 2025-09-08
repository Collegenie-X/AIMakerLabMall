// 상품 관련 타입 정의

// 상품 카테고리 타입
export type ProductCategory = string;

// 상품 이미지 타입
export interface ProductImage {
  url: string;
}

// 상품 태그 타입
export type ProductTag = string;

// 상품 상태 타입
export type ProductStatus = 'available' | 'sold_out' | 'coming_soon';

// 상품 타입
export interface Product {
  id: string | number;
  name: string;
  category: string;
  thumbnail: string;
  tags: ProductTag[];
  price: string;
  duration: string;
  status: ProductStatus;
  created_at: string;
  description?: string[];
  product_detail_info?: string;
  images?: ProductImage[];
}

// 상품 리스트 필터 타입
export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'bestseller';
  search?: string;
  page?: number;
  limit?: number;
}

// 상품 목록 메타 정보
export interface ProductListMeta {
  total: number;
  pages: number;
  current_page: number;
}

// 상품 목록 응답 데이터
export interface ProductListData {
  products: Product[];
  meta: ProductListMeta;
}

// 상품 목록 응답 타입
export interface ProductListResponse {
  status: string;
  data: ProductListData;
} 