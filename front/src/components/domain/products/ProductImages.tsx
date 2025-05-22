'use client';

import { useState } from 'react';
import { Box, Grid, Chip } from '@mui/material';
import Image from 'next/image';
import { ProductImage } from '@/types/products';

interface ProductImagesProps {
  images: ProductImage[];
  productName: string;
  productId: number;
}

export default function ProductImages({ images, productName, productId }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 기본 이미지 URL 생성
  const getDefaultImageUrl = (id: number) => `/images/products/diy_kit_${(id % 3) + 1}.jpg`;

  // 현재 표시할 이미지 URL
  const mainImageUrl = selectedImage || 
    images[0]?.image || 
    getDefaultImageUrl(productId);

  return (
    <Box>
      <Box sx={{ position: 'relative', width: '100%', pb: '75%', mb: 2 }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Image
            src={mainImageUrl}
            alt={productName}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Chip
            label="초등학교추천"
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'black',
              color: 'white',
            }}
          />
        </Box>
      </Box>

      {/* 썸네일 이미지 목록 */}
      <Grid container spacing={2}>
        {[...images, { id: -1, image: getDefaultImageUrl(productId), is_primary: false }]
          .slice(0, 4)
          .map((image, index) => (
            <Grid item xs={3} key={image.id || index}>
              <Box
                sx={{
                  position: 'relative',
                  pb: '100%',
                  cursor: 'pointer',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: selectedImage === image.image ? '2px solid primary.main' : 'none',
                }}
                onClick={() => setSelectedImage(image.image)}
              >
                <Image
                  src={image.image}
                  alt={`${productName} ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 25vw, 120px"
                />
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
