'use client';

import { Grid, Card, CardMedia, CardContent, Typography, Box, styled } from '@mui/material';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

interface ProductGridProps {
  products: Product[];
}

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
});

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[4],
  }
}));

const ProductCardMedia = styled(CardMedia)({
  paddingTop: '75%', // 4:3 비율
  backgroundSize: 'contain',
  backgroundPosition: 'center',
});

const PriceText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  marginTop: theme.spacing(1)
}));

export default function ProductGrid({ products }: ProductGridProps) {
  // 가격을 한국 원화 형식으로 포맷팅하는 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { 
      style: 'currency', 
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <StyledLink href={`/products/${product.id}`}>
            <ProductCard>
              <ProductCardMedia
                image={product.imageUrl}
                title={product.name}
              />
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <PriceText variant="h6">
                  {formatPrice(product.price)}
                </PriceText>
              </CardContent>
            </ProductCard>
          </StyledLink>
        </Grid>
      ))}
    </Grid>
  );
} 