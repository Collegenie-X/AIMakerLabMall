'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Box,
  Chip,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Badge
} from '@mui/material';
import { ExpandMore, Category, Label } from '@mui/icons-material';
import productService from '@/services/productService';
import { Product } from '@/types/products.d';
import Link from 'next/link';

/**
 * 교육 제품 목록을 표시하는 컴포넌트
 * 카테고리별, 태그별로 그룹화하여 2열 레이아웃으로 표시
 */
export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  /**
   * 상품 목록을 API에서 가져오는 함수
   */
  const fetchProductsData = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      setProducts(response.data.products);
      
      // 첫 번째 카테고리를 기본적으로 열어둠
      if (response.data.products.length > 0) {
        const firstCategory = response.data.products[0].category;
        setExpandedCategories([firstCategory]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 카테고리별로 상품을 그룹화하는 함수
   */
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    
    products.forEach(product => {
      const category = product.category || '기타';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
    });
    
    // 카테고리별로 상품 수에 따라 정렬
    return Object.entries(groups).sort(([, a], [, b]) => b.length - a.length);
  }, [products]);

  /**
   * 카테고리 아코디언 토글 함수
   */
  const handleCategoryToggle = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  /**
   * 로딩 상태 UI 렌더링 함수
   */
  const renderLoadingSkeletons = () => (
    <Box sx={{ mt: 4 }}>
      {[1, 2].map((category) => (
        <Accordion key={category} expanded>
          <AccordionSummary>
            <Skeleton variant="text" width={200} height={30} />
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 4
              }}
            >
              {[1, 2, 3, 4].map((item) => (
                <Card sx={{ height: 450 }} key={item}>
                  <Skeleton variant="rectangular" height={280} />
                  <CardContent>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="60%" />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  /**
   * 상품 카드 렌더링 함수
   */
  const renderProductCard = (product: Product) => (
    <Link 
      href={`/products/${product.id}`} 
      style={{ textDecoration: 'none' }}
      key={product.id}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-12px)',
            boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
          },
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #e0e0e0'
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            sx={{
              height: 280,
              objectFit: 'cover',
              backgroundColor: '#f8f9fa'
            }}
            image={product.images?.[0]?.url || `/images/products/diy_kit_${(Number(product.id) % 3) + 1}.jpg`}
            alt={product.name}
          />
          
          {/* 상태 배지 */}
          <Chip
            label={product.status === 'available' ? '판매중' : '품절'}
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: product.status === 'available' ? '#4caf50' : '#f44336',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />
          
          {/* 태그들 */}
          {product.tags && product.tags.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5
              }}
            >
              {product.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.9)',
                    color: '#1976d2',
                    fontSize: '0.7rem',
                    height: 24
                  }}
                />
              ))}
              {product.tags.length > 3 && (
                <Chip
                  label={`+${product.tags.length - 3}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.9)',
                    color: '#666',
                    fontSize: '0.7rem',
                    height: 24
                  }}
                />
              )}
            </Box>
          )}
        </Box>
        
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2"
            sx={{ 
              fontWeight: 700,
              fontSize: '1.2rem',
              lineHeight: 1.3,
              mb: 2,
              minHeight: '2.6rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.name}
          </Typography>
          
          {/* 상품 설명 (description 배열의 첫 번째 항목) */}
          {product.description && product.description.length > 0 && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                minHeight: '2.4rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {product.description[0]}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Chip
              icon={<AccessTime sx={{ fontSize: 16 }} />}
              label={`수업시간: ${product.duration}`}
              variant="outlined"
              size="small"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mt: 'auto', pt: 1 }}>
            <Typography 
              variant="h5" 
              color="primary"
              sx={{ 
                fontWeight: 700,
                fontSize: '1.4rem',
                textAlign: 'right'
              }}
            >
              {new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: 'KRW'
              }).format(Number(product.price))}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );

  /**
   * 카테고리별 상품 그룹 렌더링 함수
   */
  const renderCategoryGroup = ([category, categoryProducts]: [string, Product[]]) => (
    <Accordion
      key={category}
      expanded={expandedCategories.includes(category)}
      onChange={() => handleCategoryToggle(category)}
      sx={{
        mb: 3,
        borderRadius: 2,
        '&:before': { display: 'none' },
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          bgcolor: '#f5f5f5',
          borderRadius: '8px 8px 0 0',
          '&.Mui-expanded': {
            borderRadius: '8px 8px 0 0',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Category sx={{ color: '#1976d2' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {category}
          </Typography>
          <Badge 
            badgeContent={categoryProducts.length} 
            color="primary"
            sx={{ ml: 1 }}
          />
        </Box>
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 4,
            width: '100%'
          }}
        >
          {categoryProducts.map(renderProductCard)}
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: '#1976d2',
            mb: 2
          }}
        >
          교육 제품 (Kit)
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
        >
          창의적이고 실용적인 교육용 키트로 학습의 재미를 더해보세요
        </Typography>
        
        {/* 통계 정보 */}
        {!loading && products.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
            <Chip
              icon={<Category />}
              label={`${groupedProducts.length}개 카테고리`}
              variant="outlined"
              sx={{ fontSize: '0.9rem' }}
            />
            <Chip
              icon={<Label />}
              label={`총 ${products.length}개 제품`}
              variant="outlined"
              sx={{ fontSize: '0.9rem' }}
            />
          </Box>
        )}
      </Box>
      
      {loading ? renderLoadingSkeletons() : (
        <Box>
          {groupedProducts.length > 0 ? (
            groupedProducts.map(renderCategoryGroup)
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                등록된 제품이 없습니다.
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
}

import { AccessTime } from '@mui/icons-material';
