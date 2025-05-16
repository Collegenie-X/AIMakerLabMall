'use client';

import { Suspense } from 'react';
import { Container, CircularProgress, Typography, Box } from '@mui/material';
import KakaoCallbackHandler from './KakaoCallbackHandler';

function LoadingComponent() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>카카오 로그인 처리 중...</Typography>
      </Box>
    </Container>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <KakaoCallbackHandler />
    </Suspense>
  );
} 