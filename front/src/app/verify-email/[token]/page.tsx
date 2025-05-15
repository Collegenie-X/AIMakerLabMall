'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Container, Paper, Typography, CircularProgress, Box } from '@mui/material';

export default function VerifyEmail({ params }: { params: { token: string } }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/v1/auth/verify-email/', {
          token: params.token
        });

        if (response.status === 200) {
          setStatus('success');
          setMessage(response.data.message);
          
          // Store user data and tokens
          localStorage.setItem('token', response.data.tokens.access);
          localStorage.setItem('refresh_token', response.data.tokens.refresh);
          localStorage.setItem('user', response.data.user.name);

          // Redirect to home page after 2 seconds
          setTimeout(() => {
            router.push('/');
          }, 2000);
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.error || '이메일 인증에 실패했습니다.');
      }
    };

    verifyEmail();
  }, [params.token, router]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>이메일 인증 진행 중...</Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <Typography variant="h5" color="primary" gutterBottom>
              이메일 인증 완료
            </Typography>
            <Typography>{message}</Typography>
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              잠시 후 메인 페이지로 이동합니다...
            </Typography>
          </>
        )}

        {status === 'error' && (
          <>
            <Typography variant="h5" color="error" gutterBottom>
              인증 실패
            </Typography>
            <Typography color="error">{message}</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                문제가 지속되면 고객센터로 문의해주세요.
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
} 