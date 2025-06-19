import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { API_CONFIG, apiHelpers } from '../../config/api';

/**
 * 문의 작성 폼 데이터 인터페이스
 */
interface InquiryFormData {
  title: string;
  requester_name: string;
  phone: string;
  email: string;
  course_type: string;
  student_count: number | '';
  student_grade: string;
  preferred_date: string;
  preferred_time: string;
  duration: string;
  location: string;
  budget: string;
  message: string;
}

/**
 * 문의 작성 페이지 컴포넌트
 */
const InquiryCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<InquiryFormData>({
    title: '',
    requester_name: '',
    phone: '',
    email: '',
    course_type: '',
    student_count: '',
    student_grade: '',
    preferred_date: '',
    preferred_time: '',
    duration: '',
    location: '',
    budget: '',
    message: ''
  });

  /**
   * 폼 데이터 변경 처리
   */
  const handleChange = (field: keyof InquiryFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * 폼 제출 처리
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.title || !formData.requester_name || !formData.phone || 
        !formData.email || !formData.course_type || !formData.location) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        apiHelpers.getFullUrl(API_CONFIG.ENDPOINTS.OUTREACH_INQUIRIES + '/'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '문의 등록에 실패했습니다.');
      }

      const result = await response.json();
      setSuccess(true);
      
      // 3초 후 문의 목록으로 이동
      setTimeout(() => {
        navigate('/inquiries');
      }, 3000);

    } catch (error) {
      console.error('문의 등록 오류:', error);
      setError(error instanceof Error ? error.message : '문의 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h4" color="success.main" gutterBottom>
              문의가 성공적으로 등록되었습니다! 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              빠른 시일 내에 연락드리겠습니다.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/inquiries')}>
              문의 목록으로 이동
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          🚀 코딩 출강 교육 문의 작성
        </Typography>
        <Typography variant="body1" color="text.secondary">
          학교, 기관, 단체를 대상으로 하는 맞춤형 코딩 교육 서비스를 문의해주세요.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* 기본 정보 */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  📝 기본 정보
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="문의 제목"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="예: 초등학교 3학년 대상 앱 인벤터 교육"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="담당자명"
                  value={formData.requester_name}
                  onChange={(e) => handleChange('requester_name', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="연락처"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="예: 02-1234-5678"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="이메일"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="교육 장소"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="예: 서울초등학교"
                />
              </Grid>

              {/* 교육 정보 */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                  🎯 교육 정보
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>교육 과정</InputLabel>
                  <Select
                    value={formData.course_type}
                    label="교육 과정"
                    onChange={(e) => handleChange('course_type', e.target.value)}
                  >
                    <MenuItem value="python">파이썬 코딩</MenuItem>
                    <MenuItem value="arduino">아두이노</MenuItem>
                    <MenuItem value="ai">AI 코딩</MenuItem>
                    <MenuItem value="scratch">스크래치</MenuItem>
                    <MenuItem value="app-inventor">앱 인벤터</MenuItem>
                    <MenuItem value="web-development">웹 개발</MenuItem>
                    <MenuItem value="game-development">게임 개발</MenuItem>
                    <MenuItem value="robotics">로보틱스</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="학생 수"
                  type="number"
                  value={formData.student_count}
                  onChange={(e) => handleChange('student_count', parseInt(e.target.value) || '')}
                  placeholder="예: 25"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="대상 학년"
                  value={formData.student_grade}
                  onChange={(e) => handleChange('student_grade', e.target.value)}
                  placeholder="예: 초등 3-4학년"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="희망 예산"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  placeholder="예: 50만원"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="희망 일자"
                  type="date"
                  value={formData.preferred_date}
                  onChange={(e) => handleChange('preferred_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="희망 시간"
                  type="time"
                  value={formData.preferred_time}
                  onChange={(e) => handleChange('preferred_time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* 추가 정보 */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                  ➕ 추가 정보
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="교육 시간"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  placeholder="예: 2시간, 4시간, 8시간"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="상세 문의 내용"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="교육 목표, 특별 요구사항, 기타 문의사항을 상세히 작성해주세요."
                />
              </Grid>

              {/* 제출 버튼 */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/inquiries')}
                    disabled={loading}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    size="large"
                    sx={{ px: 4 }}
                  >
                    {loading ? <CircularProgress size={24} /> : '📤 문의 등록'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default InquiryCreatePage; 