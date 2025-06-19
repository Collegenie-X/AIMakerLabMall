'use client';

import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Box,
  Chip
} from '@mui/material';
import { getProducts } from '@/services/productService';
import { Product } from '@/types/products';
import Link from 'next/link';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        교육 제품 (Kit)
      </Typography>
      
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >                <CardMedia
                  component="img"
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                    backgroundColor: '#f5f5f5'
                  }}
                  image={product.images[0]?.image || `/images/products/diy_kit_${(product.id % 3) + 1}.jpg`}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Chip
                      label="초등학교추천"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -40,
                        left: -8,
                        bgcolor: 'black',
                        color: 'white',
                      }}
                    />
                  </Box>
                  <Typography gutterBottom variant="h6" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    수업시간: {product.duration} 
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {new Intl.NumberFormat('ko-KR', {
                      style: 'currency',
                      currency: 'KRW'
                    }).format(product.price)}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
