'use client';
import { useParams } from 'next/navigation';
import { Container, Grid, Box, Typography, CircularProgress, Alert, Paper, useMediaQuery, useTheme } from '@mui/material';
import { useProductDetail } from '@/hooks/useProductDetail';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductPurchaseBox from './ProductPurchaseBox';

// 제품 상세 정보의 이미지를 위한 CSS 스타일
const detailContentStyle = `
  .product-detail-content {
    max-width: 100%;
    overflow-x: hidden;
  }
  .product-detail-content img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1rem auto;
  }
  .product-detail-content p {
    margin-bottom: 1rem;
  }
  
  @media (min-width: 900px) {
    .product-container {
      display: flex !important;
      flex-direction: row !important;
    }
    
    .product-gallery {
      width: 45% !important;
      flex: 0 0 45% !important;
    }
    
    .product-info {
      width: 55% !important;
      flex: 0 0 55% !important;
    }
  }
`;

export default function ProductDetailContainer() {
  const params = useParams();
  const productId = params?.id || '1';
  const { product, loading, error } = useProductDetail(productId);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 로딩 중 표시
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // 에러 표시
  if (error || !product) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">
            {error ? error.message : '상품 정보를 불러올 수 없습니다.'}
          </Alert>
        </Box>
      </Container>
    );
  }

  // 상품 이미지 URL 배열 생성
  const imageUrls = product.images.map(img => img.url);

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 4,
        px: { xs: 1, sm: 2 }
      }}
    >
      {/* 스타일 추가 */}
      <style jsx global>{detailContentStyle}</style>
      
      {/* 상단 영역: 좌우 분할 */}
      <Paper 
        elevation={1} 
        sx={{ 
          mb: 4, 
          overflow: 'hidden',
          maxWidth: '100%'
        }}
      >
        <Box 
          className="product-container"
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%'
          }}
        >
          {/* 왼쪽: 이미지 갤러리 */}
          <Box 
            className="product-gallery"
            sx={{ 
              width: { xs: '100%', md: '45%' },
              borderRight: { md: '1px solid #eee' },
              borderBottom: { xs: '1px solid #eee', md: 'none' }
            }}
          >
            <ProductImageGallery images={imageUrls} />
          </Box>

          {/* 오른쪽: 상품 정보 및 구매 영역 */}
          <Box 
            className="product-info"
            sx={{ 
              width: { xs: '100%', md: '55%' },
              p: { xs: 2, md: 3 }
            }}
          >
            {/* 상품 정보 */}
            <ProductInfo
              name={product.name}
              price={parseFloat(product.price)}
              category={product.category}
              duration={product.duration}
              tags={product.tags}
            />
            
            <Box sx={{ mt: 4, mb: 2 }}>
              <ProductPurchaseBox
                productId={product.id}
                price={parseFloat(product.price)}
                status={product.status}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* 하단 영역: 상품 상세 정보 (전체 너비) */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>상품 설명</Typography>
        <Box sx={{ mb: 4 }}>
          {product.description.map((desc, index) => (
            <Typography key={index} paragraph>
              {desc}
            </Typography>
          ))}
        </Box>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>상세 정보</Typography>
        <Box 
          className="product-detail-content"
          sx={{ mt: 2 }} 
          dangerouslySetInnerHTML={{ __html: product.product_detail_info }} 
        />
      </Paper>
    </Container>
  );
} 