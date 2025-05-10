import { Box, Grid, Typography, Button } from '@mui/material';
import Image from 'next/image';

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

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Box className="bg-white rounded-lg shadow-md overflow-hidden">
            <Box className="relative h-48">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </Box>
            <Box className="p-4">
              <Typography variant="h6" className="mb-2">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-4">
                {product.description}
              </Typography>
              <Box className="flex justify-between items-center">
                <Typography variant="h6" color="primary">
                  {new Intl.NumberFormat('ko-KR', {
                    style: 'currency',
                    currency: 'KRW'
                  }).format(product.price)}
                </Typography>
                <Button variant="contained" color="primary">
                  자세히 보기
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
} 