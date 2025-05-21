'use client';
import { Container, Grid, Box } from '@mui/material';
import { productDetailConfig } from '@/config/productDetailConfig';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductPurchaseBox from './ProductPurchaseBox';
import ProductDescription from './ProductDescription';

export default function ProductDetailContainer() {
  return (
    <Container maxWidth="lg">
      {/* 상단 영역: 좌우 분할 */}
      <Box sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* 왼쪽: 이미지 갤러리 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
              <ProductImageGallery images={productDetailConfig.images} />
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
                  name={productDetailConfig.name}
                  price={productDetailConfig.price}
                  originalPrice={productDetailConfig.originalPrice}
                  shipping={productDetailConfig.shipping}
                  origin={productDetailConfig.origin}
                  shippingMethod={productDetailConfig.shippingMethod}
                />
              </Box>

              {/* 구매 박스 */}
              <Box>
                <ProductPurchaseBox
                  price={productDetailConfig.price}
                  shipping={productDetailConfig.shipping}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* 하단 영역: 상품 상세 정보 (전체 너비) */}
      <Box sx={{ py: 4 }}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          <ProductDescription description={productDetailConfig.description} />
        </Box>
      </Box>
    </Container>
  );
} 