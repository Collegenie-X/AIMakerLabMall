// 상품 관련 API 호출 서비스
// 상품 목록 조회, 상세 조회 등의 API 함수 구현

import axios from 'axios';
import { Product, ProductFilter, ProductListResponse } from '../types/products.d';

// API 기본 URL 설정 (.env에서 이미 /api/v1이 포함됨)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Products 전용 Axios 인스턴스 생성
 * 토큰 없이도 접근 가능하도록 별도 구성
 * baseURL에 /api/v1 중복 제거
 */
const productsApiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Products API 응답 인터셉터 설정
 * 401 오류 발생 시에도 graceful handling
 */
productsApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Products API에서 401 오류가 발생해도 무시 (토큰 없이 접근 허용)
    if (error.response?.status === 401) {
      console.warn('Products API: 토큰 없이 접근 중입니다 (정상 동작)');
    }
    return Promise.reject(error);
  }
);

/**
 * 상품 목록 조회 API 함수
 * 로그인 없이 모든 사용자 접근 가능
 * 
 * @param filter - 상품 필터링 옵션 (카테고리, 검색어 등)
 * @returns 상품 목록 응답 데이터
 */
const getProducts = async (filter?: Partial<ProductFilter>): Promise<ProductListResponse> => {
  try {
    const response = await productsApiInstance.get('/products/', { params: filter });
    return response.data;
  } catch (error: any) {
    console.error('상품 목록 조회 중 오류 발생:', error);
    throw new Error(error.response?.data?.message || '상품 목록을 불러올 수 없습니다.');
  }
};

/**
 * 상품 상세 조회 API 함수
 * 로그인 없이 모든 사용자 접근 가능
 * 
 * @param id - 상품 ID
 * @returns 상품 상세 정보
 */
const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await productsApiInstance.get(`/products/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error(`상품 상세 조회 중 오류 발생 (ID: ${id}):`, error);
    throw new Error(error.response?.data?.message || '상품 정보를 불러올 수 없습니다.');
  }
};

/**
 * 카테고리별 상품 목록 조회 API 함수
 * 
 * @param category - 카테고리명
 * @param filter - 추가 필터링 옵션
 * @returns 카테고리별 상품 목록
 */
const getProductsByCategory = async (
  category: string, 
  filter?: Omit<ProductFilter, 'category'>
): Promise<ProductListResponse> => {
  try {
    const response = await productsApiInstance.get('/products/', { 
      params: { ...filter, category } 
    });
    return response.data;
  } catch (error: any) {
    console.error(`카테고리별 상품 조회 중 오류 발생 (카테고리: ${category}):`, error);
    throw new Error(error.response?.data?.message || '카테고리별 상품을 불러올 수 없습니다.');
  }
};

/**
 * 상품 검색 API 함수
 * 
 * @param searchTerm - 검색어
 * @param filter - 추가 필터링 옵션
 * @returns 검색 결과 상품 목록
 */
const searchProducts = async (
  searchTerm: string, 
  filter?: Omit<ProductFilter, 'search'>
): Promise<ProductListResponse> => {
  try {
    const response = await productsApiInstance.get('/products/', { 
      params: { ...filter, search: searchTerm } 
    });
    return response.data;
  } catch (error: any) {
    console.error(`상품 검색 중 오류 발생 (검색어: ${searchTerm}):`, error);
    throw new Error(error.response?.data?.message || '상품 검색에 실패했습니다.');
  }
};

/**
 * 상품 서비스 객체
 * 모든 상품 관련 API 함수를 포함
 */
const productService = {
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts
};

export default productService; 