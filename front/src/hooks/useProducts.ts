import { useState, useEffect } from 'react';
import productService from '@/services/productService';
import { Product, ProductFilter, ProductListResponse } from '@/types/products';

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  meta: {
    total: number;
    pages: number;
    currentPage: number;
  } | null;
  refetch: () => Promise<void>;
}

/**
 * 상품 목록을 가져오는 훅
 * 
 * @param filter 상품 필터링 옵션
 * @returns 상품 목록, 로딩 상태, 에러, 메타 정보, 새로고침 함수
 */
export const useProducts = (filter?: Partial<ProductFilter>): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [meta, setMeta] = useState<UseProductsResult['meta']>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response: ProductListResponse = await productService.getProducts(filter);
      
      if (response.status === 'success' && response.data) {
        setProducts(response.data.products);
        setMeta({
          total: response.data.meta.total,
          pages: response.data.meta.pages,
          currentPage: response.data.meta.current_page,
        });
      } else {
        throw new Error('Failed to fetch products data');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filter)]);

  return { products, loading, error, meta, refetch: fetchProducts };
}; 