'use client';
import { useParams } from 'next/navigation';
import { Container, Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
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
`;

export default function ProductDetailContainer() {
  const params = useParams();
  const productId = params?.id || '1';
  const { product, loading, error } = useProductDetail(productId);

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
    <Container maxWidth="lg">
      {/* 스타일 추가 */}
      <style jsx global>{detailContentStyle}</style>
      
      {/* 상단 영역: 좌우 분할 */}
      <Box sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* 왼쪽: 이미지 갤러리 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
              <ProductImageGallery images={imageUrls} />
            </Box>
          </Grid>

          {/* 오른쪽: 상품 정보 및 구매 영역 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              height: '100%' 
            }}>
              {/* 상품 정보 */}
              <Box sx={{ flex: 1 }}>
                <ProductInfo
                  name={product.name}
                  price={parseFloat(product.price)}
                  category={product.category}
                  duration={product.duration}
                  tags={product.tags}
                />
              </Box>

              {/* 구매 박스 */}
              <Box>
                <ProductPurchaseBox
                  productId={product.id}
                  price={parseFloat(product.price)}
                  status={product.status}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* 하단 영역: 상품 상세 정보 (전체 너비) */}
      <Box sx={{ py: 4 }}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 3 }}>
          <Typography variant="h6" gutterBottom>상품 설명</Typography>
          <Box sx={{ mb: 3 }}>
            {product.description.map((desc, index) => (
              <Typography key={index} paragraph>
                {desc}
              </Typography>
            ))}
          </Box>
          
          <Typography variant="h6" gutterBottom>상세 정보</Typography>
          <Box 
            className="product-detail-content"
            sx={{ mt: 2 }} 
            dangerouslySetInnerHTML={{ __html: product.product_detail_info }} 
          />
        </Box>
      </Box>
    </Container>
  );
} 