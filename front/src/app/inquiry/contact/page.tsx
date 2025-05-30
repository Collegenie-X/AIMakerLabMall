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

/**
 * 출장 강의 문의 타입 정의
 */
interface OutreachInquiry {
  id: string;
  title: string;
  organizationName: string;
  contactPerson: string;
  phone: string;
  email: string;
  courseType: string;
  studentCount: number;
  studentGrade: string;
  preferredDate: string;
  preferredTime: string;
  duration: string;
  location: string;
  message: string;
  status: '접수대기' | '검토중' | '견적발송' | '확정' | '완료';
  createdAt: string;
  budget?: string;
  equipment?: string[];
  specialRequests?: string;
}

/**
 * 문의 폼 타입 정의
 */
interface InquiryForm {
  title: string;
  organizationName: string;
  contactPerson: string;
  phone: string;
  email: string;
  courseType: string;
  studentCount: string;
  studentGrade: string;
  preferredDate: string;
  preferredTime: string;
  duration: string;
  location: string;
  message: string;
  budget: string;
  specialRequests: string;
}

/**
 * 출장 강의 문의 페이지 컴포넌트
 * 기관/학교에서 출장 강의를 문의할 수 있는 게시판 형태의 페이지
 */
export default function OutreachInquiryPage() {
  const [inquiryList, setInquiryList] = useState<OutreachInquiry[]>([
    {
      id: '1',
      title: '초등학교 3학년 대상 앱 인벤터 교육',
      organizationName: '서울초등학교',
      contactPerson: '김선생',
      phone: '02-1234-5678',
      email: 'teacher@school.ac.kr',
      courseType: 'app-inventor',
      studentCount: 25,
      studentGrade: '초등 3학년',
      preferredDate: '2025.06.15',
      preferredTime: '14:00',
      duration: '2시간',
      location: '서울초등학교 컴퓨터실',
      message: '3학년 학생들이 처음 접하는 코딩 수업으로, 앱 인벤터를 활용한 간단한 앱 만들기를 희망합니다.',
      status: '접수대기',
      createdAt: '2025.05.29',
      budget: '300만원',
      equipment: ['태블릿', '프로젝터', '스피커'],
      specialRequests: '학생들이 처음 접하는 코딩이므로 쉽고 재미있게 설명해주세요.'
    },
    {
      id: '2',
      title: '중학교 아두이노 IoT 프로젝트 수업',
      organizationName: '강남중학교',
      contactPerson: '이담임',
      phone: '02-9876-5432',
      email: 'lee@middle.ac.kr',
      courseType: 'arduino',
      studentCount: 30,
      studentGrade: '중학 2학년',
      preferredDate: '2025.06.20',
      preferredTime: '10:00',
      duration: '4시간',
      location: '강남중학교 과학실',
      message: '아두이노를 활용한 IoT 센서 프로젝트 수업을 원합니다. 실습 위주로 진행해주세요.',
      status: '검토중',
      createdAt: '2025.05.29',
      budget: '500만원',
      equipment: ['아두이노 키트', '센서 모듈', '노트북'],
      specialRequests: '학생 개인별 키트 제공 및 실습 위주 진행 희망'
    },
    {
      id: '3',
      title: '고등학교 Python AI 기초 교육',
      organizationName: '명덕고등학교',
      contactPerson: '박교사',
      phone: '02-5555-1234',
      email: 'park@highschool.ac.kr',
      courseType: 'python',
      studentCount: 35,
      studentGrade: '고등 1학년',
      preferredDate: '2025.07.05',
      preferredTime: '13:00',
      duration: '6시간 (3일)',
      location: '명덕고등학교 정보실',
      message: 'Python을 활용한 AI 기초 교육으로, 머신러닝 기본 개념과 실습을 포함해주세요.',
      status: '견적발송',
      createdAt: '2025.05.28',
      budget: '800만원',
      equipment: ['노트북', 'Python 환경', '프로젝터'],
      specialRequests: 'AI 관련 진로 상담도 함께 진행해주시면 좋겠습니다.'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<OutreachInquiry | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState<InquiryForm>({
    title: '',
    organizationName: '',
    contactPerson: '',
    phone: '',
    email: '',
    courseType: '',
    studentCount: '',
    studentGrade: '',
    preferredDate: '',
    preferredTime: '',
    duration: '',
    location: '',
    message: '',
    budget: '',
    specialRequests: ''
  });
  const [submitted, setSubmitted] = useState(false);

  /**
   * 상태별 색상 반환
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case '접수대기': return '#9e9e9e';
      case '검토중': return '#ff9800';
      case '견적발송': return '#2196f3';
      case '확정': return '#4caf50';
      case '완료': return '#8bc34a';
      default: return '#9e9e9e';
    }
  };

  /**
   * 상태별 아이콘 반환
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case '접수대기': return <Pending />;
      case '검토중': return <Info />;
      case '견적발송': return <Email />;
      case '확정': return <CheckCircle />;
      case '완료': return <CheckCircle />;
      default: return <Pending />;
    }
  };

  /**
   * 교육 과정명 반환
   */
  const getCourseTypeName = (courseType: string) => {
    switch (courseType) {
      case 'app-inventor': return '앱 인벤터';
      case 'arduino': return '아두이노';
      case 'raspberry-pi': return 'Raspberry Pi';
      case 'ai': return 'AI 코딩';
      case 'python': return '파이썬 코딩';
      default: return courseType;
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
  };

  /**
   * 문의 작성 폼 닫기
   */
  const handleCloseForm = () => {
    setOpenForm(false);
    setFormData({
      title: '',
      organizationName: '',
      contactPerson: '',
      phone: '',
      email: '',
      courseType: '',
      studentCount: '',
      studentGrade: '',
      preferredDate: '',
      preferredTime: '',
      duration: '',
      location: '',
      message: '',
      budget: '',
      specialRequests: ''
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
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const newInquiry: OutreachInquiry = {
      id: Date.now().toString(),
      title: formData.title,
      organizationName: formData.organizationName,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      courseType: formData.courseType,
      studentCount: parseInt(formData.studentCount),
      studentGrade: formData.studentGrade,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      duration: formData.duration,
      location: formData.location,
      message: formData.message,
      status: '접수대기',
      createdAt: new Date().toLocaleDateString('ko-KR'),
      budget: formData.budget,
      specialRequests: formData.specialRequests,
      equipment: []
    };

    setInquiryList(prev => [newInquiry, ...prev]);
    setSubmitted(true);
    
    setTimeout(() => {
      handleCloseForm();
    }, 2000);
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
        {/* 좌측: 빠른 문의 및 연락처 - 더 좁게 */}
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
                  {inquiryList.length}
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
                  {inquiryList.reduce((sum, i) => sum + i.studentCount, 0)}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.65rem' }}>교육 대상자</Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* 우측: 문의 목록 - 더 넓게 */}
        <Grid item xs={12} md={9.5} sx={{ minWidth: 750 }}>
          {/* 헤더 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              📋 코딩 출강 교육 문의 목록
            </Typography>
            <Stack direction="row" spacing={2}>
              <Chip 
                label={`총 ${inquiryList.length}건`} 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
              <Chip 
                label={`진행중 ${inquiryList.filter(i => i.status !== '완료').length}건`} 
                color="warning" 
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
            </Stack>
          </Box>

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
                    width: '35%',
                    fontSize: '0.95rem',
                    py: 2
                  }}>
                    제목 / 기관명
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    width: '20%',
                    fontSize: '0.95rem',
                    py: 2
                  }}>
                    담당자 / 연락처
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    width: '15%',
                    fontSize: '0.95rem',
                    py: 2
                  }}>
                    교육과정
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    width: '15%',
                    fontSize: '0.95rem',
                    py: 2
                  }}>
                    상태
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    width: '15%',
                    fontSize: '0.95rem',
                    py: 2
                  }}>
                    액션
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inquiryList.map((inquiry) => (
                  <TableRow 
                    key={inquiry.id} 
                    sx={{ 
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={() => handleViewDetails(inquiry)}
                  >
                    {/* 제목 / 기관명 */}
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {inquiry.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Business sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
                        <Typography variant="body2" color="text.secondary">
                          {inquiry.organizationName}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* 담당자 / 연락처 */}
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {inquiry.contactPerson}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {inquiry.phone}
                      </Typography>
                    </TableCell>
                    
                    {/* 교육과정 */}
                    <TableCell sx={{ py: 2.5 }}>
                      <Chip
                        label={getCourseTypeName(inquiry.courseType)}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ 
                          mb: 0.5, 
                          display: 'block',
                          fontWeight: 'bold'
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {inquiry.studentCount}명
                      </Typography>
                    </TableCell>
                    
                    {/* 상태 */}
                    <TableCell sx={{ py: 2.5 }}>
                      <Chip
                        icon={getStatusIcon(inquiry.status)}
                        label={inquiry.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(inquiry.status),
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                          mb: 0.5
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {inquiry.createdAt}
                      </Typography>
                    </TableCell>
                    
                    {/* 액션 */}
                    <TableCell sx={{ py: 2.5 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(inquiry);
                        }}
                        sx={{ 
                          color: '#1976d2',
                          borderColor: '#1976d2',
                          fontSize: '0.8rem',
                          minWidth: 'auto',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1.5,
                          '&:hover': {
                            backgroundColor: '#e3f2fd'
                          }
                        }}
                      >
                        상세보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 하단 빠른 액션 */}
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Card sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  borderRadius: 1.5,
                  border: '1px solid #90caf9',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
                }}
                onClick={handleMoveToSchedule}
                >
                  <CalendarMonth sx={{ fontSize: 28, color: '#1976d2', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    정규 수업
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={3}>
                <Card sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  borderRadius: 1.5,
                  border: '1px solid #ce93d8',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
                }}
                onClick={handleOpenForm}
                >
                  <Add sx={{ fontSize: 28, color: '#9c27b0', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    새 문의
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={3}>
                <Card sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  borderRadius: 1.5,
                  border: '1px solid #a5d6a7',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
                }}>
                  <Phone sx={{ fontSize: 28, color: '#4caf50', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    전화상담
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={3}>
                <Card sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  borderRadius: 1.5,
                  border: '1px solid #ffcc02',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
                }}>
                  <Email sx={{ fontSize: 28, color: '#ff9800', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    이메일 문의
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* 상세보기 다이얼로그 */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            코딩 출강 교육 문의 상세
          </Typography>
          {selectedInquiry && (
            <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
              {selectedInquiry.title}
            </Typography>
          )}
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {selectedInquiry && (
            <Grid container>
              {/* 좌측: 기본 정보 */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, backgroundColor: '#f8f9fa', height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    문의 정보
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                        기관/학교명
                      </Typography>
                      <Typography variant="body1">{selectedInquiry.organizationName}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                        담당자
                      </Typography>
                      <Typography variant="body1">{selectedInquiry.contactPerson}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                        연락처
                      </Typography>
                      <Typography variant="body1">{selectedInquiry.phone}</Typography>
                      <Typography variant="body2">{selectedInquiry.email}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                        상태
                      </Typography>
                      <Chip
                        icon={getStatusIcon(selectedInquiry.status)}
                        label={selectedInquiry.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(selectedInquiry.status),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              {/* 우측: 교육 정보 */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    교육 상세 정보
                  </Typography>

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                        교육 과정
                      </Typography>
                      <Chip
                        label={getCourseTypeName(selectedInquiry.courseType)}
                        color="primary"
                        variant="filled"
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                        대상 및 인원
                      </Typography>
                      <Typography variant="body1">
                        {selectedInquiry.studentGrade} / {selectedInquiry.studentCount}명
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                        희망 일정
                      </Typography>
                      <Typography variant="body1">
                        {selectedInquiry.preferredDate} {selectedInquiry.preferredTime} ({selectedInquiry.duration})
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                        장소
                      </Typography>
                      <Typography variant="body1">{selectedInquiry.location}</Typography>
                    </Box>

                    {selectedInquiry.budget && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                          예산
                        </Typography>
                        <Typography variant="body1">{selectedInquiry.budget}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Grid>

              {/* 하단: 상세 내용 */}
              <Grid item xs={12}>
                <Box sx={{ p: 3, backgroundColor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    문의 내용
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedInquiry.message}
                  </Typography>

                  {selectedInquiry.specialRequests && (
                    <>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666', mt: 2 }}>
                        특별 요청사항
                      </Typography>
                      <Typography variant="body1">
                        {selectedInquiry.specialRequests}
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            닫기
          </Button>
          <Button 
            variant="contained"
            sx={{ background: 'linear-gradient(45deg, #1976d2, #42a5f5)' }}
          >
            답변하기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 문의 작성 다이얼로그 */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            코딩 출강 교육 문의 작성
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {submitted && (
            <Alert severity="success" sx={{ mb: 3 }}>
              출강 교육 문의가 성공적으로 등록되었습니다. 빠른 시일 내에 연락드리겠습니다.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="교육 제목"
                  required
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  placeholder="예: 초등학교 3학년 앱 인벤터 교육"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="기관/학교명"
                  required
                  value={formData.organizationName}
                  onChange={handleInputChange('organizationName')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="담당자명"
                  required
                  value={formData.contactPerson}
                  onChange={handleInputChange('contactPerson')}
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
              
              <Grid item xs={12} sm={6}>
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
                    <MenuItem value="app-inventor">앱 인벤터</MenuItem>
                    <MenuItem value="arduino">아두이노</MenuItem>
                    <MenuItem value="raspberry-pi">Raspberry Pi</MenuItem>
                    <MenuItem value="ai">AI 코딩</MenuItem>
                    <MenuItem value="python">파이썬 코딩</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="참여 인원"
                  type="number"
                  required
                  value={formData.studentCount}
                  onChange={handleInputChange('studentCount')}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>학년/연령대</InputLabel>
                  <Select
                    value={formData.studentGrade}
                    onChange={handleSelectChange('studentGrade')}
                    label="학년/연령대"
                  >
                    <MenuItem value="초등 1-2학년">초등 1-2학년</MenuItem>
                    <MenuItem value="초등 3-4학년">초등 3-4학년</MenuItem>
                    <MenuItem value="초등 5-6학년">초등 5-6학년</MenuItem>
                    <MenuItem value="중학생">중학생</MenuItem>
                    <MenuItem value="고등학생">고등학생</MenuItem>
                    <MenuItem value="성인">성인</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="희망 수업 시간"
                  required
                  value={formData.duration}
                  onChange={handleInputChange('duration')}
                  placeholder="예: 2시간, 3시간, 하루종일"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="희망 날짜"
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={handleInputChange('preferredDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="희망 시간"
                  type="time"
                  required
                  value={formData.preferredTime}
                  onChange={handleInputChange('preferredTime')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="교육 장소"
                  required
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  placeholder="예: 서울초등학교 컴퓨터실"
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
                  placeholder="교육 목표, 학생 수준, 특별 요구사항 등을 자유롭게 적어주세요."
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="기타 요청사항 (선택사항)"
                  multiline
                  rows={2}
                  value={formData.specialRequests}
                  onChange={handleInputChange('specialRequests')}
                  placeholder="장비 준비, 추가 교구, 특별한 요구사항 등"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseForm}>취소</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{ background: 'linear-gradient(45deg, #4caf50, #66bb6a)' }}
          >
            출강 교육 문의 등록
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 