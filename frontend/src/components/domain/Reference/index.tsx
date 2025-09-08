'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, IconButton } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import Image from 'next/image';

const ReferenceImages = [
  '/images/class1.jpg',
  '/images/class2.jpg',
  '/images/class3.jpg',
  '/images/class4.jpg',
];

export default function Reference() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % ReferenceImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentImage((prev) => 
      prev === 0 ? ReferenceImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % ReferenceImages.length);
  };

  return (
    <Box sx={{ py: 6, backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* 왼쪽 레퍼런스 섹션 (80%) */}
          <Grid item xs={12} md={9.6}>
            <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, height: '100%' }}>
              <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                AI Maker Lab의 찾아가는 코딩 수업!
              </Typography>
              <Typography variant="subtitle1" paragraph>
                코딩교육의 필요한 공간에, 여기저기 달려갑니다.
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      2,959
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      개교
                    </Typography>
                    <Typography variant="body2">
                      AIMaker Lab 수업한 학교 수
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      23,761
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      시간
                    </Typography>
                    <Typography variant="body2">
                      선생님이 진행한 수업시간
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      33,667
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      명
                    </Typography>
                    <Typography variant="body2">
                      수업을 참여한 학생 수
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      95,090
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      개
                    </Typography>
                    <Typography variant="body2">
                      교육키트 누적 판매수
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      32
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      개
                    </Typography>
                    <Typography variant="body2">
                      협계약 대학 및 기관
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      25,787
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      개
                    </Typography>
                    <Typography variant="body2">
                      교육 및 수업 영상 누적 시청시간
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  교육 대상
                </Typography>
                <Grid container spacing={2}>
                  {['초등학교', '중학교', '고등학교', '대학교'].map((school) => (
                    <Grid item key={school}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1
                      }}>
                        <Typography>✓ {school}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Grid>

          {/* 오른쪽 이미지 슬라이드 섹션 (20%) */}
          <Grid item xs={12} md={2.4}>
            <Box sx={{ 
              position: 'relative',
              height: '100%',
              minHeight: 600,
              backgroundColor: 'white',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <Box sx={{ position: 'relative', height: '100%' }}>
                <Image
                  src={ReferenceImages[currentImage]}
                  alt={`수업 이미지 ${currentImage + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              
              <Box sx={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                p: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}>
                <IconButton onClick={handlePrev} sx={{ color: 'white' }}>
                  <KeyboardArrowUp />
                </IconButton>
                <IconButton onClick={handleNext} sx={{ color: 'white' }}>
                  <KeyboardArrowDown />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 