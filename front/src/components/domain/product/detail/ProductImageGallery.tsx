'use client'
import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 이전 이미지로 이동
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // 다음 이미지로 이동
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 메인 이미지 영역 */}
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1', bgcolor: '#f8f8f8' }}>
        <Box
          component="img"
          src={images[currentImageIndex]}
          alt={`상품 이미지 ${currentImageIndex + 1}`}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />

        {/* 이미지 네비게이션 버튼 */}
        <IconButton
          onClick={handlePrevImage}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: 1,
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <IconButton
          onClick={handleNextImage}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: 1,
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      {/* 썸네일 목록 */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          px: 1,
        }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              width: 60,
              height: 60,
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            <Box
              component="img"
              src={image}
              alt={`썸네일 ${index + 1}`}
              onClick={() => setCurrentImageIndex(index)}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 1,
                border: index === currentImageIndex ? '2px solid #1976d2' : '2px solid transparent',
                opacity: index === currentImageIndex ? 1 : 0.7,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            />
            {index === currentImageIndex && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  border: '2px solid #1976d2',
                  borderRadius: 1,
                  pointerEvents: 'none',
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
} 