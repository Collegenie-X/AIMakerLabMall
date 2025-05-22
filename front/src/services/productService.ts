// 상품 관련 API 호출 서비스
// 상품 목록 조회, 상세 조회 등의 API 함수 구현

import axiosInstance from './axiosInstance';
import { Product, ProductFilter, ProductListResponse } from '../types/products';

// 상품 목록 조회 API
const getProducts = async (filter?: Partial<ProductFilter>): Promise<ProductListResponse> => {
  const response = await axiosInstance.get('/products', { params: filter });
  return response.data;
};

// 상품 상세 조회 API
const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

// 카테고리별 상품 목록 조회 API
const getProductsByCategory = async (category: string, filter?: Omit<ProductFilter, 'category'>): Promise<ProductListResponse> => {
  const response = await axiosInstance.get(`/products/category/${category}`, { params: filter });
  return response.data;
};

// 상품 검색 API
const searchProducts = async (searchTerm: string, filter?: Omit<ProductFilter, 'search'>): Promise<ProductListResponse> => {
  const response = await axiosInstance.get('/products/search', { 
    params: { ...filter, search: searchTerm } 
  });
  return response.data;
};

const productService = {
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts
};

export default productService; 