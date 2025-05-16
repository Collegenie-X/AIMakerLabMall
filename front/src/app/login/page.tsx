'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Paper, Alert, Box } from '@mui/material';
import LoginDialog from '@/components/layout/Header/LoginDialog';

export default function LoginPage() {
  const [openLogin, setOpenLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');

    if (errorParam === 'kakao-login-failed') {
      setError(messageParam || '카카오 로그인에 실패했습니다. 다시 시도해주세요.');
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    // 로그인 로직 구현
  };

  const handleClose = () => {
    setOpenLogin(false);
    window.location.href = '/';
  };

  const handleRegisterClick = () => {
    window.location.href = '/register';
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Paper>
          <LoginDialog
            open={openLogin}
            onClose={handleClose}
            loginData={loginData}
            error={error}
            onInputChange={handleInputChange}
            onLogin={handleLogin}
            onRegisterClick={handleRegisterClick}
          />
        </Paper>
      </Box>
    </Container>
  );
} 