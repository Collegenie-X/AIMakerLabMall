'use client';

import { Box, Container } from '@mui/material';
import ProductCategory from '@/components/domain/ProductCategory';
import ProductGrid from '@/components/domain/ProductGrid';
import { Product } from '@/types/products';
import { ReactNode } from 'react';

interface ProductSectionProps {
  categoryTitle: string;
  categoryLinks: {
    label: string;
    url: string;
  }[];
  products: Product[] | ReactNode;
}

export default function ProductSection({ 
  categoryTitle, 
  categoryLinks, 
  products 
}: ProductSectionProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* 왼쪽 카테고리 */}
        <Box sx={{ width: { xs: '100%', md: '25%' }}}>
          <ProductCategory 
            title={categoryTitle}
            links={categoryLinks}
          />
        </Box>
        
        {/* 오른쪽 제품 그리드 */}
        <Box sx={{ width: { xs: '100%', md: '75%' }}}>
          {Array.isArray(products) ? (
            <ProductGrid products={products} columns={3} />
          ) : (
            products
          )}
        </Box>
      </Box>
    </Container>
  );
} 