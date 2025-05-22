import { useState, useEffect } from 'react';

export interface ProductImage {
  id: number;
  url: string;
  is_thumbnail: boolean;
}

export interface ProductDetail {
  id: number;
  name: string;
  category: string;
  description: string[];
  product_detail_info: string;
  price: string;
  duration: string;
  status: string;
  images: ProductImage[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: string;
  data: ProductDetail;
}

/**
 * HTML 콘텐츠 내의 이미지 URL을 수정하는 함수
 * /media/로 시작하는 상대 경로에 베이스 URL을 추가합니다.
 */
const fixImageUrls = (htmlContent: string): string => {
  if (!htmlContent) return '';
  
  // /media/로 시작하는 URL을 찾아 베이스 URL 추가
  const baseUrl = 'http://localhost:8000';
  
  // src 속성 내의 /media/ 경로 수정
  return htmlContent.replace(
    /src=["'](\/media\/[^"']+)["']/g, 
    `src="${baseUrl}$1"`
  );
};

export const useProductDetail = (productId: string | number) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/v1/products/${productId}/`);
        
        if (!response.ok) {
          throw new Error(`Error fetching product: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.status === 'success') {
          // 상세 설명의 이미지 URL 수정
          const modifiedData = {
            ...data.data,
            product_detail_info: fixImageUrls(data.data.product_detail_info)
          };
          
          setProduct(modifiedData);
        } else {
          throw new Error('Failed to fetch product data');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return { product, loading, error };
}; 