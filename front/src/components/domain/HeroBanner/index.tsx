'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, styled } from '@mui/material';
import { Slide } from '@/services/slidesService';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import Link from 'next/link';

const BannerContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '500px',
  overflow: 'hidden',
  backgroundColor: theme.palette.grey[200],
}));

const SlideContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  transition: 'opacity 0.5s ease-in-out',
}));

const SlideImage = styled(Box)<{ src: string }>(({ src }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `url(${src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  }
}));

const SlideTextContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  color: 'white',
  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  maxWidth: '600px',
}));

const NavButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  minWidth: '48px',
  height: '48px',
  padding: 0,
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
}));

const IndicatorsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
}));

interface IndicatorProps {
  isActive: boolean;
  onClick: () => void;
}

const IndicatorBox = ({ isActive, onClick }: IndicatorProps) => (
  <Box
    onClick={onClick}
    sx={{
      width: isActive ? '24px' : '8px',
      height: '8px',
      margin: '0 5px',
      borderRadius: isActive ? '4px' : '50%',
      backgroundColor: isActive ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }}
  />
);

interface HeroBannerProps {
  initialSlides: Slide[];
  autoPlayInterval?: number;
}

export default function HeroBanner({ initialSlides: slides, autoPlayInterval = 5000 }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, autoPlayInterval]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleIndicatorClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  return (
    <BannerContainer>
      {slides.map((slide, index) => (
        <SlideContent
          key={slide.id}
          sx={{ 
            opacity: index === currentSlide ? 1 : 0,
            pointerEvents: index === currentSlide ? 'auto' : 'none'
          }}
        >
          <SlideImage src={slide.imageUrl} />
          <Container>
            <SlideTextContent>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                {slide.title}
              </Typography>
              {slide.subtitle && (
                <Typography variant="h6" paragraph>
                  {slide.subtitle}
                </Typography>
              )}
              {slide.link && (
                <Button 
                  component={Link} 
                  href={slide.link} 
                  variant="contained" 
                  color="primary" 
                  size="large"
                >
                  자세히 보기
                </Button>
              )}
            </SlideTextContent>
          </Container>
        </SlideContent>
      ))}

      {slides.length > 1 && (
        <>
          <NavButton 
            onClick={handlePrev} 
            sx={{ left: { xs: 8, md: 16 } }}
          >
            <KeyboardArrowLeft />
          </NavButton>
          <NavButton 
            onClick={handleNext} 
            sx={{ right: { xs: 8, md: 16 } }}
          >
            <KeyboardArrowRight />
          </NavButton>
          
          <IndicatorsContainer>
            {slides.map((_, index) => (
              <IndicatorBox
                key={index}
                isActive={index === currentSlide}
                onClick={() => handleIndicatorClick(index)}
              />
            ))}
          </IndicatorsContainer>
        </>
      )}
    </BannerContainer>
  );
} 