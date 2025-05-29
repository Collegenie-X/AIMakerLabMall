'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { createInquiry, CreateInquiryData } from '@/services/inquiryService';
import { isAuthenticated } from '@/services/authService';

// 문의 유형 옵션
const INQUIRY_TYPES = [
  { value: 'product', label: '교구문의' },
  { value: 'price', label: '가격문의' },
  { value: 'delivery', label: '배송문의' },
  { value: 'etc', label: '기타문의' }
];

interface InquiryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * 문의 생성 다이얼로그 컴포넌트
 * 
 * 사용자가 새 문의를 생성할 때 표시되는 다이얼로그입니다.
 */
const InquiryDialog: React.FC<InquiryDialogProps> = ({ open, onClose, onSuccess }) => {
  const router = useRouter();
  
  // 폼 상태 관리
  const [formData, setFormData] = useState<CreateInquiryData>({
    title: '',
    description: '',
    inquiry_type: 'product',
    requester_name: ''
  });
  
  // 유효성 검사 및 UI 상태 관리
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    if (open) {
      setIsLoggedIn(isAuthenticated());
    }
  }, [open]);
  
  // 로그인 페이지로 이동
  const handleGoToLogin = () => {
    onClose();
    router.push('/login');
  };
  
  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // 에러 메시지 초기화
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };
  
  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '문의 내용을 입력해주세요';
    }
    
    if (!formData.requester_name.trim()) {
      newErrors.requester_name = '요청자 이름을 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      await createInquiry(formData);
      
      // 성공 시 처리
      if (onSuccess) {
        onSuccess();
      }
      
      // 다이얼로그 닫기
      onClose();
      
      // 폼 초기화
      setFormData({
        title: '',
        description: '',
        inquiry_type: 'product',
        requester_name: ''
      });
      
    } catch (error: any) {
      // 오류 처리
      setErrorMessage(error.message || '문의 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          교육 키트 구매 견적 문의
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {!isLoggedIn ? (
          // 비로그인 상태일 때 안내 메시지
          <Stack spacing={2} sx={{ py: 3 }}>
            <Alert severity="info">
              문의를 작성하려면 로그인이 필요합니다.
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleGoToLogin}
              >
                로그인 페이지로 이동
              </Button>
            </Box>
          </Stack>
        ) : (
          // 로그인 상태일 때 문의 폼
          <Stack spacing={3} sx={{ mt: 1 }}>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            
            <TextField
              name="title"
              label="문의 제목"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              disabled={isSubmitting}
              required
            />
            
            <FormControl fullWidth error={!!errors.inquiry_type}>
              <InputLabel id="inquiry-type-label">문의 유형</InputLabel>
              <Select
                labelId="inquiry-type-label"
                name="inquiry_type"
                value={formData.inquiry_type}
                onChange={handleChange}
                disabled={isSubmitting}
                label="문의 유형"
              >
                {INQUIRY_TYPES.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              name="requester_name"
              label="요청자 정보 (소속/이름)"
              fullWidth
              value={formData.requester_name}
              onChange={handleChange}
              error={!!errors.requester_name}
              helperText={errors.requester_name || '예: 대구초등학교 김교사'}
              disabled={isSubmitting}
              required
            />
            
            <TextField
              name="description"
              label="문의 내용"
              multiline
              rows={6}
              fullWidth
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={isSubmitting}
              required
            />
          </Stack>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={isSubmitting}
        >
          취소
        </Button>
        {isLoggedIn && (
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? '제출 중...' : '문의 제출'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InquiryDialog; 