'use client';

import { Box, Card, CardMedia, CardContent, Typography, styled, Chip } from '@mui/material';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  category?: string;
  duration?: string;
}

interface ProductGridProps {
  products: Product[];
  columns?: number;
}

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
});

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[2],
  }
}));

const ProductCardMedia = styled(CardMedia)({
  height: 250,
  width: 250,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: 10, 
  border: '1px solid #ddd', 
});

const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  left: 10,
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontSize: '0.75rem',
  height: 24,
}));

const ProductTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const DurationText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '0.875rem',
  fontWeight: 'bold',
}));

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
}));

export default function ProductGrid({ products, columns = 3 }: ProductGridProps) {
  return (
    <GridContainer sx={{ 
      gridTemplateColumns: {
        xs: '1fr',
        sm: '1fr 1fr',
        md: `repeat(${columns}, 1fr)`
      }
    }}>
      {products.map((product) => (
        <StyledLink key={product.id} href={`/products/${product.id}`}>
          <ProductCard elevation={0}>
            <Box sx={{ position: 'relative' }}>
              <ProductCardMedia
                image={product.imageUrl}
                title={product.name}
              />
              {product.category && (
                <CategoryChip label={product.category} size="small" />
              )}
            </Box>
            <CardContent>
              <ProductTitle variant="subtitle1">
                {product.name}
              </ProductTitle>
              {product.duration && (
                <DurationText>
                  수업시간: {product.duration} 시간
                </DurationText>
              )}
            </CardContent>
          </ProductCard>
        </StyledLink>
      ))}
    </GridContainer>
  );
} 