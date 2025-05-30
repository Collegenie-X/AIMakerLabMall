'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert
} from '@mui/material';
import { Phone, Email, LocationOn, Schedule } from '@mui/icons-material';

/**
 * 수업 문의 타입 정의
 */
interface InquiryForm {
  name: string;
  phone: string;
  email: string;
  courseType: string;
  studentCount: string;
  preferredSchedule: string;
  message: string;
}

/**
 * 수업 문의 페이지 컴포넌트
 * 사용자가 AI 교육 수업에 대해 문의할 수 있는 폼을 제공
 */
export default function InquiryContactPage() {
  const [formData, setFormData] = useState<InquiryForm>({
    name: '',
    phone: '',
    email: '',
    courseType: '',
    studentCount: '',
    preferredSchedule: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  /**
   * 폼 입력값 변경 핸들러
   */
  const handleInputChange = (field: keyof InquiryForm) => 
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    };

  /**
   * 선택 필드 변경 핸들러
   */
  const handleSelectChange = (field: keyof InquiryForm) => 
    (event: any) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    };

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('문의 데이터:', formData);
    setSubmitted(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          수업 문의
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          AI MAKER LAB의 창의적인 교육 프로그램에 대해 문의해보세요.
          전문 강사진이 맞춤형 교육을 제공해 드립니다.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* 연락처 정보 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(145deg, #1976d2, #42a5f5)' }}>
            <CardContent sx={{ color: 'white', p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                연락처 정보
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body1">전화 문의</Typography>
                  <Typography variant="body2">02-1234-5678</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body1">이메일</Typography>
                  <Typography variant="body2">info@aimakerlab.com</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body1">운영 시간</Typography>
                  <Typography variant="body2">평일 09:00 - 18:00</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body1">위치</Typography>
                  <Typography variant="body2">서울시 강남구 테헤란로</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 문의 폼 */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              {submitted ? (
                <Alert severity="success" sx={{ mb: 3 }}>
                  문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.
                </Alert>
              ) : null}

              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                문의 양식
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="성명"
                      required
                      value={formData.name}
                      onChange={handleInputChange('name')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="연락처"
                      required
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="이메일"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange('email')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>희망 교육 과정</InputLabel>
                      <Select
                        value={formData.courseType}
                        onChange={handleSelectChange('courseType')}
                        label="희망 교육 과정"
                      >
                        <MenuItem value="app-inventor">앱 인벤터 코딩</MenuItem>
                        <MenuItem value="arduino">아두이노 코딩</MenuItem>
                        <MenuItem value="raspberry-pi">Raspberry pi 코딩</MenuItem>
                        <MenuItem value="ai">AI 코딩</MenuItem>
                        <MenuItem value="maker">메이커 교육</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>참여 인원</InputLabel>
                      <Select
                        value={formData.studentCount}
                        onChange={handleSelectChange('studentCount')}
                        label="참여 인원"
                      >
                        <MenuItem value="1-5">1-5명</MenuItem>
                        <MenuItem value="6-10">6-10명</MenuItem>
                        <MenuItem value="11-20">11-20명</MenuItem>
                        <MenuItem value="21-30">21-30명</MenuItem>
                        <MenuItem value="30+">30명 이상</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>희망 일정</InputLabel>
                      <Select
                        value={formData.preferredSchedule}
                        onChange={handleSelectChange('preferredSchedule')}
                        label="희망 일정"
                      >
                        <MenuItem value="weekday-morning">평일 오전</MenuItem>
                        <MenuItem value="weekday-afternoon">평일 오후</MenuItem>
                        <MenuItem value="weekend">주말</MenuItem>
                        <MenuItem value="flexible">조정 가능</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="추가 문의사항"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange('message')}
                      placeholder="교육 목표, 특별 요청사항, 기타 문의사항을 자유롭게 적어주세요."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ 
                        mt: 2, 
                        py: 1.5,
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                        }
                      }}
                    >
                      문의 보내기
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 교육 과정 미리보기 */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          제공 교육 과정
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {[
            { name: '앱 인벤터', color: '#4caf50' },
            { name: '아두이노', color: '#ff9800' },
            { name: 'Raspberry Pi', color: '#e91e63' },
            { name: 'AI 코딩', color: '#9c27b0' },
            { name: '메이커 교육', color: '#2196f3' }
          ].map((course) => (
            <Grid item key={course.name}>
              <Chip 
                label={course.name} 
                sx={{ 
                  backgroundColor: course.color,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  px: 1
                }} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
} 