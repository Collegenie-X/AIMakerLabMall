import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { API_CONFIG, apiHelpers } from '../../config/api';

/**
 * 로그인 페이지 컴포넌트
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 폼 데이터 변경 처리
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /**
   * 로그인 처리
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('사용자명과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 임시 로그인 처리 (실제로는 백엔드 API 연동 필요)
      if (formData.username === 'admin' && formData.password === 'admin123') {
        localStorage.setItem('token', 'temp-admin-token');
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          is_staff: true
        }));
        navigate('/');
      } else if (formData.username === 'testuser' && formData.password === 'test123') {
        localStorage.setItem('token', 'temp-user-token');
        localStorage.setItem('user', JSON.stringify({
          id: 2,
          username: 'testuser',
          email: 'testuser@example.com',
          is_staff: false
        }));
        navigate('/');
      } else {
        setError('사용자명 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 테스트 계정 로그인
   */
  const handleTestLogin = (username: string, password: string) => {
    setFormData({ username, password });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          로그인
        </Typography>
        
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          AI Maker Lab에 오신 것을 환영합니다
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="username"
            label="사용자명"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
            autoFocus
          />
          
          <TextField
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : '로그인'}
          </Button>
        </Box>

        {/* 테스트 계정 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            테스트 계정
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleTestLogin('admin', 'admin123')}
            >
              관리자 계정
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleTestLogin('testuser', 'test123')}
            >
              일반 사용자
            </Button>
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            테스트용 계정입니다. 실제 서비스에서는 제거됩니다.
          </Typography>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button color="primary" onClick={() => navigate('/')}>
            홈으로 돌아가기
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage; 