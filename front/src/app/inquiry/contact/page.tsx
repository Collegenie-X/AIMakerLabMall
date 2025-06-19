'use client';

import { useState, useEffect } from 'react';
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
  Alert,
  Stack,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
  LinearProgress
} from '@mui/material';
import { 
  Phone, 
  Email, 
  LocationOn, 
  Schedule,
  Add,
  Visibility,
  School,
  Group,
  CalendarMonth,
  AccessTime,
  Place,
  Person,
  Business,
  Info,
  CheckCircle,
  Pending
} from '@mui/icons-material';
import { 
  getPaginatedOutreachInquiries,
  getOutreachInquiryStats,
  createOutreachInquiry,
  getCourseTypeName,
  getStatusName,
  type OutreachInquiry,
  type CreateOutreachInquiryData,
  type OutreachInquiryStats
} from '@/services/outreachInquiryService';

/**
 * 문의 폼 타입 정의
 */
interface InquiryForm {
  title: string;
  requester_name: string;
  phone: string;
  email: string;
  course_type: string;
  student_count: string;
  student_grade: string;
  preferred_date: string;
  preferred_time: string;
  duration: string;
  location: string;
  message: string;
  budget: string;
  special_requests: string;
}

/**
 * 출장 강의 문의 페이지 컴포넌트
 * 기관/학교에서 출장 강의를 문의할 수 있는 게시판 형태의 페이지
 * 실제 API 데이터를 사용하여 출강 문의 목록을 표시
 */
export default function OutreachInquiryPage() {
  // 데이터 상태
  const [inquiryList, setInquiryList] = useState<OutreachInquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<OutreachInquiryStats | null>(null);
  
  // UI 상태
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<OutreachInquiry | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // 폼 데이터
  const [formData, setFormData] = useState<InquiryForm>({
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
    message: '',
    budget: '',
    special_requests: ''
  });

  /**
   * 컴포넌트 마운트 시 데이터 로드
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    loadInquiriesData();
    loadStatsData();
  }, []);

  /**
   * 출강 문의 목록 데이터 로드
   */
  const loadInquiriesData = async () => {
    try {
      setLoading(true);
      const response = await getPaginatedOutreachInquiries(1, 10);
      setInquiryList(response.results);
    } catch (error) {
      console.error('출강 문의 목록 로딩 오류:', error);
      setInquiryList([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 통계 데이터 로드
   */
  const loadStatsData = async () => {
    try {
      const statsData = await getOutreachInquiryStats();
      setStats(statsData);
    } catch (error) {
      console.error('통계 데이터 로딩 오류:', error);
      // 기본 통계 데이터 설정
      setStats({
        total_inquiries: 0,
        total_students: 0,
        status_breakdown: {},
        course_type_breakdown: {},
        pending_count: 0,
        in_progress_count: 0,
        completed_count: 0
      });
    }
  };

  /**
   * 상태별 색상 반환
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case '접수대기': return '#9e9e9e';
      case '검토중': return '#ff9800';
      case '견적발송': return '#2196f3';
      case '확정': return '#4caf50';
      case '진행중': return '#9c27b0';
      case '완료': return '#4caf50';
      case '취소': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  /**
   * 상태별 아이콘 반환
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case '접수대기': return <Pending sx={{ fontSize: 16 }} />;
      case '검토중': return <Info sx={{ fontSize: 16 }} />;
      case '견적발송': return <Email sx={{ fontSize: 16 }} />;
      case '확정': return <CheckCircle sx={{ fontSize: 16 }} />;
      case '진행중': return <Schedule sx={{ fontSize: 16 }} />;
      case '완료': return <CheckCircle sx={{ fontSize: 16 }} />;
      case '취소': return <Pending sx={{ fontSize: 16 }} />;
      default: return <Pending sx={{ fontSize: 16 }} />;
    }
  };

  /**
   * 상세보기 다이얼로그 열기
   */
  const handleViewDetails = (inquiry: OutreachInquiry) => {
    setSelectedInquiry(inquiry);
    setOpenDialog(true);
  };

  /**
   * 상세보기 다이얼로그 닫기
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInquiry(null);
  };

  /**
   * 문의 작성 폼 열기
   */
  const handleOpenForm = () => {
    setOpenForm(true);
    setSubmitted(false);
  };

  /**
   * 문의 작성 폼 닫기
   */
  const handleCloseForm = () => {
    setOpenForm(false);
    setFormData({
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
      message: '',
      budget: '',
      special_requests: ''
    });
    setSubmitted(false);
  };

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
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      // API 데이터 형식에 맞게 변환
      const createData: CreateOutreachInquiryData = {
        title: formData.title,
        requester_name: formData.requester_name,
        phone: formData.phone,
        email: formData.email,
        course_type: formData.course_type,
        student_count: parseInt(formData.student_count) || 1,
        student_grade: formData.student_grade,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        duration: formData.duration,
        location: formData.location,
        message: formData.message,
        budget: formData.budget || undefined,
        special_requests: formData.special_requests || undefined
      };

      // API 호출하여 새 문의 생성
      await createOutreachInquiry(createData);
      
      // 성공 시 목록 새로고침
      await loadInquiriesData();
      await loadStatsData();
      
      setSubmitted(true);
      setTimeout(() => {
        handleCloseForm();
      }, 1500);
      
    } catch (error) {
      console.error('문의 생성 중 오류:', error);
      alert('문의 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  /**
   * 일정 페이지로 이동 (호환성)
   */
  const handleMoveToSchedule = () => {
    window.location.href = '/inquiry/schedule';
  };

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: 3 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          코딩 출강 및 수업 문의
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          학교, 기관, 단체를 대상으로 전문 강사가 직접 찾아가는 맞춤형 코딩 교육 서비스입니다. 
          언제든지 문의해 주시면 최적의 교육 프로그램을 제안해 드리겠습니다.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 좌측: 빠른 문의 및 연락처 */}
        <Grid item xs={12} md={2.5} sx={{ minWidth: 240, maxWidth: 280 }}>
          {/* 빠른 문의 작성 */}
          <Card sx={{ mb: 2, border: '1px solid #1976d2', borderRadius: 1.5 }}>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '0.9rem' }}>
                ⚡ 출강 문의 작성
              </Typography>
              <Button
                variant="contained"
                onClick={handleOpenForm}
                startIcon={<Add sx={{ fontSize: 16 }} />}
                fullWidth
                size="small"
                sx={{ 
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  py: 0.8,
                  mb: 1.5,
                  borderRadius: 1.5,
                  fontSize: '0.8rem'
                }}
              >
                새 출강 교육 문의
              </Button>
              <Button
                variant="outlined"
                onClick={handleMoveToSchedule}
                startIcon={<CalendarMonth sx={{ fontSize: 16 }} />}
                fullWidth
                size="small"
                sx={{ 
                  borderColor: '#1976d2', 
                  color: '#1976d2',
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                정규 수업 일정 보기
              </Button>
            </CardContent>
          </Card>

          {/* 연락처 정보 */}
          <Card sx={{ background: 'linear-gradient(145deg, #1976d2, #42a5f5)', mb: 2, borderRadius: 1.5 }}>
            <CardContent sx={{ color: 'white', p: 1.5 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                📞 연락처 정보
              </Typography>
              
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ mr: 1, fontSize: 18 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>전화 문의</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>02-1234-5678</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 1, fontSize: 18 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>이메일</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>info@aimakerlab.com</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ mr: 1, fontSize: 18 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>운영시간</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>평일 09:00 - 18:00</Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* 간단한 통계 */}
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 1.5, 
                backgroundColor: '#f3e5f5', 
                borderRadius: 1.5,
                border: '1px solid #e1bee7'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0', fontSize: '1.2rem' }}>
                  {stats?.total_inquiries || 0}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.65rem' }}>총 문의</Typography>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 1.5, 
                backgroundColor: '#e8f5e8', 
                borderRadius: 1.5,
                border: '1px solid #c8e6c9'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50', fontSize: '1.2rem' }}>
                  {stats?.total_students || 0}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.65rem' }}>교육 대상자</Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* 우측: 문의 목록 */}
        <Grid item xs={12} md={9.5} sx={{ minWidth: 750 }}>
          {/* 헤더 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              📋 코딩 출강 교육 문의 목록
            </Typography>
            <Stack direction="row" spacing={2}>
              <Chip 
                label={`총 ${stats?.total_inquiries || 0}건`} 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
              <Chip 
                label={`진행중 ${stats?.in_progress_count || 0}건`} 
                color="warning" 
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
            </Stack>
          </Box>

          {/* 로딩 표시 */}
          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {/* 핵심 정보만 포함한 간소화된 테이블 */}
          <TableContainer component={Paper} sx={{ 
            boxShadow: 3, 
            borderRadius: 2,
            border: '1px solid #e0e0e0'
          }}>
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    width: '40%',
                    fontSize: '0.95rem',
                    py: 2
                  }}>
                    제목 / 요청자
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    width: '20%',
                    fontSize: '0.95rem',
                    py: 2
                  }}>
                    교육과정
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    width: '20%',
                    fontSize: '0.95rem',
                    py: 2
                  }}>
                    상태
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    width: '20%',
                    fontSize: '0.95rem',
                    py: 2
                  }}>
                    생성일
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inquiryList && inquiryList.length > 0 ? (
                  inquiryList.map((inquiry) => (
                    <TableRow 
                      key={inquiry.id} 
                      hover
                      onClick={() => handleViewDetails(inquiry)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {inquiry.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {inquiry.requester_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={inquiry.course_type_display || getCourseTypeName(inquiry.course_type)}
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(inquiry.status)}
                          label={getStatusName(inquiry.status)}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(inquiry.status),
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>
                          {new Date(inquiry.created_at).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {loading ? '데이터를 불러오는 중...' : '문의 내역이 없습니다.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* 상세 정보 다이얼로그 */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)', 
          color: 'white',
          fontWeight: 'bold'
        }}>
          📋 출강 교육 문의 상세
        </DialogTitle>
        
        {selectedInquiry && (
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                {selectedInquiry.title}
              </Typography>
              <Chip
                label={getCourseTypeName(selectedInquiry.course_type)}
                color="primary"
                variant="filled"
                sx={{ mb: 2 }}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666', mb: 0.5 }}>
                    요청자 정보
                  </Typography>
                  <Typography variant="body1">
                    {selectedInquiry.requester_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedInquiry.phone} | {selectedInquiry.email}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666', mb: 0.5 }}>
                    교육 대상 및 인원
                  </Typography>
                  <Typography variant="body1">
                    {selectedInquiry.student_grade} / {selectedInquiry.student_count}명
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666', mb: 0.5 }}>
                    희망 일정
                  </Typography>
                  <Typography variant="body1">
                    {selectedInquiry.preferred_date} {selectedInquiry.preferred_time} ({selectedInquiry.duration})
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666', mb: 0.5 }}>
                    교육 장소
                  </Typography>
                  <Typography variant="body1">
                    {selectedInquiry.location}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666', mb: 1 }}>
              교육 요청사항
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedInquiry.message}
            </Typography>

            {selectedInquiry.special_requests && (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666', mt: 2 }}>
                  특별 요청사항
                </Typography>
                <Typography variant="body1">
                  {selectedInquiry.special_requests}
                </Typography>
              </>
            )}

            {selectedInquiry.budget && (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666', mt: 2 }}>
                  예산
                </Typography>
                <Typography variant="body1">
                  {selectedInquiry.budget}
                </Typography>
              </>
            )}

            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                문의 등록일: {new Date(selectedInquiry.created_at).toLocaleDateString('ko-KR')}
              </Typography>
            </Box>
          </DialogContent>
        )}
        
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 새 문의 작성 다이얼로그 */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)', 
          color: 'white',
          fontWeight: 'bold'
        }}>
          ✏️ 새로운 출강 교육 문의
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {submitted && (
              <Alert severity="success" sx={{ mb: 2 }}>
                문의가 성공적으로 등록되었습니다! 빠른 시일 내에 연락드리겠습니다.
              </Alert>
            )}
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="교육 제목"
                  required
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  placeholder="예: 초등학교 3학년 대상 앱 인벤터 교육"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="요청자명"
                  required
                  value={formData.requester_name}
                  onChange={handleInputChange('requester_name')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="연락처"
                  required
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  placeholder="010-1234-5678"
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
                    value={formData.course_type}
                    onChange={handleSelectChange('course_type')}
                    label="희망 교육 과정"
                  >
                    <MenuItem value="app-inventor">앱 인벤터</MenuItem>
                    <MenuItem value="arduino">아두이노</MenuItem>
                    <MenuItem value="raspberry-pi">Raspberry Pi</MenuItem>
                    <MenuItem value="ai">AI 코딩</MenuItem>
                    <MenuItem value="python">파이썬 코딩</MenuItem>
                    <MenuItem value="scratch">스크래치</MenuItem>
                    <MenuItem value="web-development">웹 개발</MenuItem>
                    <MenuItem value="game-development">게임 개발</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="참여 인원"
                  type="number"
                  required
                  value={formData.student_count}
                  onChange={handleInputChange('student_count')}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>학년/연령대</InputLabel>
                  <Select
                    value={formData.student_grade}
                    onChange={handleSelectChange('student_grade')}
                    label="학년/연령대"
                  >
                    <MenuItem value="초등 1-2학년">초등 1-2학년</MenuItem>
                    <MenuItem value="초등 3-4학년">초등 3-4학년</MenuItem>
                    <MenuItem value="초등 5-6학년">초등 5-6학년</MenuItem>
                    <MenuItem value="중학생">중학생</MenuItem>
                    <MenuItem value="고등학생">고등학생</MenuItem>
                    <MenuItem value="성인">성인</MenuItem>
                    <MenuItem value="전체">전체</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="희망 날짜"
                  type="date"
                  required
                  value={formData.preferred_date}
                  onChange={handleInputChange('preferred_date')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="희망 시간"
                  type="time"
                  required
                  value={formData.preferred_time}
                  onChange={handleInputChange('preferred_time')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>교육 시간</InputLabel>
                  <Select
                    value={formData.duration}
                    onChange={handleSelectChange('duration')}
                    label="교육 시간"
                  >
                    <MenuItem value="1시간">1시간</MenuItem>
                    <MenuItem value="2시간">2시간</MenuItem>
                    <MenuItem value="3시간">3시간</MenuItem>
                    <MenuItem value="4시간">4시간</MenuItem>
                    <MenuItem value="6시간">6시간</MenuItem>
                    <MenuItem value="8시간">8시간</MenuItem>
                    <MenuItem value="기타">기타</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="교육 장소"
                  required
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  placeholder="예: 서울시 강남구 OO초등학교"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="예산 (선택사항)"
                  value={formData.budget}
                  onChange={handleInputChange('budget')}
                  placeholder="예: 300만원"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="교육 요청사항"
                  multiline
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleInputChange('message')}
                  placeholder="교육 목적, 학생 수준, 특별한 요구사항 등을 자세히 적어주세요."
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="기타 요청사항 (선택사항)"
                  multiline
                  rows={2}
                  value={formData.special_requests}
                  onChange={handleInputChange('special_requests')}
                  placeholder="장비 준비, 추가 교구, 특별한 요구사항 등"
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseForm} color="secondary">
              취소
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={submitted}
            >
              {submitted ? '등록 중...' : '문의 등록'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
} 