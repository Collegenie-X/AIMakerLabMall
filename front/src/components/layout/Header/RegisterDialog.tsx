import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
} from '@mui/material';
import axios from 'axios';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onRegister: (data: RegisterData) => Promise<void>;
  error?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password2: string;
}

export const RegisterDialog = ({
  open,
  onClose,
  onRegister,
  error
}: RegisterDialogProps) => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    password2: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<RegisterData>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const errors: Partial<RegisterData> = {};
    
    if (!formData.email) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다.';
    }
    
    if (!formData.password) {
      errors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      errors.password = '비밀번호는 8자 이상이어야 합니다.';
    }
    
    if (!formData.password2) {
      errors.password2 = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.password2) {
      errors.password2 = '비밀번호가 일치하지 않습니다.';
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/register/', formData);
      if (response.status === 201) {
        setRegistrationSuccess(true);
        setRegisteredEmail(formData.email);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.data) {
        setFormErrors(error.response.data);
      }
    }
  };

  const handleClose = () => {
    if (registrationSuccess) {
      setFormData({
        email: '',
        password: '',
        password2: ''
      });
      setFormErrors({});
      setRegistrationSuccess(false);
      setRegisteredEmail('');
    }
    onClose();
  };

  if (registrationSuccess) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>이메일 인증 필요</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="success">
              회원가입이 완료되었습니다!
            </Alert>
            <Typography>
              {registeredEmail}로 인증 메일이 발송되었습니다.
              이메일을 확인하여 인증을 완료해주세요.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              이메일이 도착하지 않았다면 스팸 메일함을 확인해주세요.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="contained">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>회원가입</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="이메일"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            fullWidth
            required
          />
          <TextField
            label="비밀번호"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            fullWidth
            required
          />
          <TextField
            label="비밀번호 확인"
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleInputChange}
            error={!!formErrors.password2}
            helperText={formErrors.password2}
            fullWidth
            required
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>취소</Button>
        <Button onClick={handleSubmit} variant="contained">
          가입하기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterDialog; 