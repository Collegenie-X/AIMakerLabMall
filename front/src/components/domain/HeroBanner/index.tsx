import { Box, Typography } from '@mui/material';
import Image from 'next/image';

interface Slide {
  imageUrl: string;
  title: string;
  subtitle: string;
}

interface HeroBannerProps {
  slides: Slide[];
}

export default function HeroBanner({ slides }: HeroBannerProps) {
  return (
    <Box className="relative w-full h-[400px] overflow-hidden">
      {slides.map((slide, index) => (
        <Box key={index} className="absolute inset-0">
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <Box className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
            <Typography variant="h2" className="mb-4">
              {slide.title}
            </Typography>
            <Typography variant="h5">
              {slide.subtitle}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
} 