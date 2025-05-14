import React, { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';
import axios from 'axios';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // 메시지 상태 추가

  const handleLogin = async () => {
    setLoading(true);
    setMessage(''); // 이전 메시지 초기화
    try {
      const response = await axios.post('http://localhost:8000/login', {
        email,
        password,
      });
      
      // 토큰을 localStorage에 저장
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setMessage('로그인 성공!');
        console.log('로그인 성공:', response.data);
        // TODO: 로그인 성공 후 리다이렉트 또는 추가 작업
      } else {
        setMessage('로그인 실패: 토큰을 받지 못했습니다.');
      }
    } catch (error) {
      // 로그인 실패 처리
      setMessage('로그인 실패: 이메일 또는 패스워드를 확인하세요.');
      console.error('로그인 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, width: 300 }}>
      <Stack spacing={2}>
        <TextField
          label="이메일"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="패스워드"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </Button>
        {message && (
          <Box sx={{ color: message.includes('성공') ? 'green' : 'red', textAlign: 'center' }}>{message}</Box>
        )}
      </Stack>
    </Box>
  );
}