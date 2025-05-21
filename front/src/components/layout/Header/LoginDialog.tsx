import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Divider,
  Link,
  Box
} from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import * as authService from '@/services/authService';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import axios from 'axios';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  loginData: {
    email: string;
    password: string;
  };
  error: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogin: () => void;
  onRegisterClick: () => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const LoginDialog = ({
  open,
  onClose,
  loginData,
  error,
  onInputChange,
  onLogin,
  onRegisterClick,
  setError
}: LoginDialogProps) => {
  const { setUserName } = useUser();

  const handleKakaoLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = KAKAO_AUTH_URL;
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // 백엔드로 토큰 전송
      const response = await authService.handleGoogleLogin(idToken);
         
      if (response.status === 200 && response.data) {
            // Store tokens and user data
            localStorage.setItem('token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);
            localStorage.setItem('user', response.data.user.email);
            
            console.log('구글 로그인 성공:', response.data);
            // Update global state
            setUserName(response.data.user.email);
            
            // Redirect to home page
            onClose(); 
          }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google 로그인에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>로그인</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, minWidth: '300px' }}>
          <TextField
            autoFocus
            label="이메일"
            type="email"
            name="email"
            value={loginData.email}
            onChange={onInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="비밀번호"
            type="password"
            name="password"
            value={loginData.password}
            onChange={onInputChange}
            fullWidth
            variant="outlined"
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2 }}
            onClick={onLogin}
          >
            로그인
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              계정이 없으신가요?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={onRegisterClick}
                sx={{ textDecoration: 'none' }}
              >
                회원가입
              </Link>
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }}>소셜 로그인</Divider>

          <Button 
            variant="outlined" 
            fullWidth 
            onClick={handleGoogleLogin}
            sx={{ 
              mb: 1,
              bgcolor: '#fff',
              color: '#757575',
              borderColor: '#757575',
              '&:hover': {
                borderColor: '#616161',
                bgcolor: '#fafafa'
              }
            }}
          >
            Google로 로그인
          </Button>
          <Button 
            variant="contained" 
            fullWidth
            onClick={handleKakaoLogin}
            sx={{ 
              bgcolor: '#FEE500',
              color: '#000',
              '&:hover': {
                bgcolor: '#FDD835'
              }
            }}
          >
            카카오톡으로 로그인
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>취소</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;