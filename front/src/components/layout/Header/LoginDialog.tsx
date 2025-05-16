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
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
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
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (!credential) {
        throw new Error('No credentials returned from Google');
      }

      // Get ID token
      const idToken = await result.user.getIdToken();
      
      // Send the ID token to your backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google/callback/`,
        { id_token: idToken },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200 && response.data) {
        // Store tokens and user data
        localStorage.setItem('token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        localStorage.setItem('user', response.data.user.name);
        
        // Update global state
        setUserName(response.data.user.name);
        
        // Close dialog
        onClose();
      }
    } catch (error) {
      console.error('Google login error:', error);
      let errorMessage = '로그인 중 오류가 발생했습니다.';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      
      // You might want to show an error message to the user here
      // For example, you could set an error state and display it in the UI
      setError(errorMessage);
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