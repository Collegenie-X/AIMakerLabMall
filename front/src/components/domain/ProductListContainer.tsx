'use client';

import React from 'react';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { useProducts } from '@/hooks/useProducts';
import { ProductFilter } from '@/types/products';
import ProductGrid from '@/components/domain/ProductGrid';

interface ProductListContainerProps {
  filter?: Partial<ProductFilter>;
  title?: string;
}

export default function ProductListContainer({ 
  filter, 
  title = '추천 제품' 
}: ProductListContainerProps) {
  const { products, loading, error } = useProducts(filter);
  
  // 상품 데이터를 ProductGrid 컴포넌트에 맞게 변환
  const mappedProducts = products.map(product => ({
    id: product.id.toString(),
    name: product.name,
    imageUrl: product.thumbnail,
    price: parseFloat(product.price),
    category: product.category,
    duration: product.duration
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        상품을 불러오는 중 오류가 발생했습니다: {error.message}
      </Alert>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography align="center">
          표시할 상품이 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      <ProductGrid products={mappedProducts} columns={3} />
    </Box>
  );
} 