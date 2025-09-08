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
  LinearProgress,
  Menu,
  ListItemIcon,
  ListItemText,
  Snackbar
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
  Pending,
  Close,
  MoreVert,
  Edit,
  Delete
} from '@mui/icons-material';
import { 
  getPaginatedOutreachInquiries,
  getOutreachInquiryStats,
  createOutreachInquiry,
  updateOutreachInquiry,
  deleteOutreachInquiry,
  getCourseTypeName,
  getStatusName,
  type OutreachInquiry,
  type CreateOutreachInquiryData,
  type UpdateOutreachInquiryData,
  type OutreachInquiryStats,
  getOutreachInquiryById
} from '@/services/outreachInquiryService';

/**
 * 로그인 상태를 확인하는 함수
 * 브라우저 환경에서 토큰 존재 여부로 판단
 */
const checkLoginStatus = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return !!token;
};

/**
 * 숫자를 한글 금액으로 변환하는 함수
 */
const convertToKoreanCurrency = (amount: number): string => {
  if (!amount || amount === 0) return '';
  
  const units = ['', '만', '억', '조'];
  const result = [];
  let tempAmount = amount;
  
  for (let i = 0; i < units.length && tempAmount > 0; i++) {
    const currentUnit = tempAmount % 10000;
    if (currentUnit > 0) {
      result.unshift(`${currentUnit}${units[i]}`);
    }
    tempAmount = Math.floor(tempAmount / 10000);
  }
  
  return result.join(' ') + '원';
};

/**
 * 숫자를 천 단위 구분자로 포맷팅하는 함수
 */
const formatNumberWithCommas = (num: string): string => {
  if (!num) return '';
  return parseInt(num).toLocaleString('ko-KR');
};

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
  duration_custom: string;
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
  const [openEditForm, setOpenEditForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginAlert, setShowLoginAlert] = useState<boolean>(false);

  // 더보기 메뉴 상태
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedInquiryForMenu, setSelectedInquiryForMenu] = useState<OutreachInquiry | null>(null);
  
  // 팝업 메시지 상태
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

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
    duration_custom: '',
    location: '',
    message: '',
    budget: '',
    special_requests: ''
  });

  // 수정 폼 데이터
  const [editFormData, setEditFormData] = useState<InquiryForm>({
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
    duration_custom: '',
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
    
    // 로그인 상태 확인
    setIsLoggedIn(checkLoginStatus());
    
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
   * 로그인 필요 알림 표시 함수
   */
  const showLoginRequiredAlert = () => {
    setShowLoginAlert(true);
    setTimeout(() => {
      setShowLoginAlert(false);
    }, 3000);
  };

  /**
   * 로그인 페이지로 이동하는 함수
   */
  const goToLoginPage = () => {
    window.location.href = '/login';
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
   * 로그인된 사용자만 상세 정보 조회 가능
   * 백엔드에서 상세 정보를 별도로 조회하여 모든 필드 표시
   */
  const handleViewDetails = async (inquiry: OutreachInquiry) => {
    // 로그인 상태 재확인
    const currentLoginStatus = checkLoginStatus();
    setIsLoggedIn(currentLoginStatus);
    
    if (!currentLoginStatus) {
      showLoginRequiredAlert();
      return;
    }
    
    try {
      setLoading(true);
      console.log(`📋 ID ${inquiry.id}의 상세 정보를 조회합니다...`);
      
      // 백엔드에서 상세 정보 조회
      const detailData = await getOutreachInquiryById(inquiry.id);
      console.log('✅ 상세 정보 조회 완료:', detailData);
      
      setSelectedInquiry(detailData);
      setOpenDialog(true);
      
    } catch (error: any) {
      console.error('❌ 상세 정보 조회 오류:', error);
      
      // 권한 오류인 경우
      if (error.response?.status === 401 || error.response?.status === 403) {
        showLoginRequiredAlert();
        return;
      }
      
      // 기타 오류 메시지 표시
      const errorMessage = error.response?.data?.detail || 
                          error.message || 
                          '상세 정보를 불러올 수 없습니다.';
      
      showMessage(`❌ 오류: ${errorMessage}`, 'error');
      
    } finally {
      setLoading(false);
    }
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
   * 로그인한 사용자만 새 문의 작성 가능
   */
  const handleOpenForm = () => {
    // 로그인 상태 확인
    const currentLoginStatus = checkLoginStatus();
    setIsLoggedIn(currentLoginStatus);
    
    if (!currentLoginStatus) {
      showLoginRequiredAlert();
      return;
    }
    
    setOpenForm(true);
    setSubmitted(false);
  };

  /**
   * 문의 작성 폼 닫기
   */
  const handleCloseForm = () => {
    setOpenForm(false);
    setSubmitted(false);
    setSubmissionStatus('idle');
    setSuccessMessage('');
    
    // 폼 데이터 초기화
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
      duration_custom: '',
      location: '',
      message: '',
      budget: '',
      special_requests: ''
    });
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
   * API 201 응답 후 게시판 새로고침 및 성공 메시지 표시
   * 함수형 모듈형 구조로 순차적 처리
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      setSubmissionStatus('submitting');
      
      // 1단계: API 데이터 형식 변환
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
        duration_custom: formData.duration_custom,
        location: formData.location,
        message: formData.message,
        budget: formData.budget || undefined,
        special_requests: formData.special_requests || undefined
      };

      // 2단계: 백엔드 API 호출 (201 응답 대기)
      const response = await createOutreachInquiry(createData);
      console.log('✅ 문의 생성 성공:', response);
      
      // 3단계: 성공 상태 설정
      setSubmissionStatus('success');
      setSuccessMessage('🎉 문의가 완료되었습니다! 빠른 시일 내에 연락드리겠습니다.');
      setSubmitted(true);
      
      // 중앙 팝업 메시지 표시
      showMessage('🎉 문의가 완료되었습니다! 빠른 시일 내에 연락드리겠습니다.', 'success');
      
      // 4단계: 데이터 새로고침 (병렬 처리)
      console.log('📊 게시판 데이터 새로고침 중...');
      await Promise.all([
        loadInquiriesData(),
        loadStatsData()
      ]);
      console.log('✅ 게시판 데이터 새로고침 완료');
      
      // 5단계: 2초 후 폼 자동 닫기
      setTimeout(() => {
        console.log('🔄 폼 닫기 및 상태 초기화');
        handleCloseForm();
        setSubmissionStatus('idle');
        setSuccessMessage('');
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ 문의 생성 중 오류:', error);
      setSubmissionStatus('error');
      setSuccessMessage('문의 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
      
      // 오류 상태 초기화
      setTimeout(() => {
        setSubmissionStatus('idle');
      }, 1500);
    }
  };

  /**
   * 일정 페이지로 이동 (호환성)
   */
  const handleMoveToSchedule = () => {
    window.location.href = '/inquiry/schedule';
  };

  /**
   * 수정 폼 열기
   */
  const handleOpenEditForm = () => {
    if (selectedInquiry) {
      // 선택된 문의의 데이터로 수정 폼 초기화
      setEditFormData({
        title: selectedInquiry.title || '',
        requester_name: selectedInquiry.requester_name || '',
        phone: selectedInquiry.phone || '',
        email: selectedInquiry.email || '',
        course_type: selectedInquiry.course_type || '',
        student_count: selectedInquiry.student_count?.toString() || '',
        student_grade: selectedInquiry.student_grade || '',
        preferred_date: selectedInquiry.preferred_date || '',
        preferred_time: selectedInquiry.preferred_time || '',
        duration: selectedInquiry.duration || '',
        duration_custom: selectedInquiry.duration_custom || '',
        location: selectedInquiry.location || '',
        message: selectedInquiry.message || '',
        budget: selectedInquiry.budget || '',
        special_requests: selectedInquiry.special_requests || ''
      });
      setOpenEditForm(true);
      setOpenDialog(false); // 상세 다이얼로그 닫기
    }
  };

  /**
   * 수정 폼 닫기
   */
  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    setSubmissionStatus('idle');
    setSuccessMessage('');
  };

  /**
   * 수정 폼 입력값 변경 핸들러
   */
  const handleEditInputChange = (field: keyof InquiryForm) => 
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    };

  /**
   * 수정 폼 선택 필드 변경 핸들러
   */
  const handleEditSelectChange = (field: keyof InquiryForm) => 
    (event: any) => {
      setEditFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    };

  /**
   * 수정 폼 제출 핸들러
   */
  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedInquiry) return;
    
    try {
      setSubmissionStatus('submitting');
      
      // API 데이터 형식에 맞게 변환
      const updateData: UpdateOutreachInquiryData = {
        title: editFormData.title,
        requester_name: editFormData.requester_name,
        phone: editFormData.phone,
        email: editFormData.email,
        course_type: editFormData.course_type,
        student_count: parseInt(editFormData.student_count) || 1,
        student_grade: editFormData.student_grade,
        preferred_date: editFormData.preferred_date,
        preferred_time: editFormData.preferred_time,
        duration: editFormData.duration,
        duration_custom: editFormData.duration_custom,
        location: editFormData.location,
        message: editFormData.message,
        budget: editFormData.budget || undefined,
        special_requests: editFormData.special_requests || undefined
      };

      // API 호출하여 문의 수정
      const response = await updateOutreachInquiry(selectedInquiry.id, updateData);
      console.log('문의 수정 성공:', response);
      
      setSubmissionStatus('success');
      setSuccessMessage(`"${editFormData.title}" 문의가 성공적으로 수정되었습니다!`);
      
      // 중앙 팝업 메시지 표시
      showMessage(`"${editFormData.title}" 문의가 수정되었습니다!`, 'success');
      
      // 게시판 데이터 새로고침
      await Promise.all([
        loadInquiriesData(),
        loadStatsData()
      ]);
      
      // 성공 메시지 표시 후 폼 닫기
      setTimeout(() => {
        handleCloseEditForm();
        setSubmissionStatus('idle');
        setSuccessMessage('');
      }, 2000);
      
    } catch (error: any) {
      console.error('문의 수정 중 오류:', error);
      setSubmissionStatus('error');
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          '문의 수정 중 오류가 발생했습니다.';
      
      alert(`❌ 오류 발생: ${errorMessage}\n다시 시도해주세요.`);
      
      // 오류 상태 초기화
      setTimeout(() => {
        setSubmissionStatus('idle');
      }, 1000);
    }
  };

  /**
   * 더보기 메뉴 열기
   */
  const handleMoreClick = (event: React.MouseEvent<HTMLElement>, inquiry: OutreachInquiry) => {
    event.stopPropagation(); // 테이블 행 클릭 이벤트 방지
    setAnchorEl(event.currentTarget);
    setSelectedInquiryForMenu(inquiry);
  };

  /**
   * 더보기 메뉴 닫기
   */
  const handleMoreClose = () => {
    setAnchorEl(null);
    setSelectedInquiryForMenu(null);
  };

  /**
   * 팝업 메시지 표시 함수
   */
  const showMessage = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  /**
   * 팝업 메시지 닫기
   */
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  /**
   * 문의 삭제 함수
   * 작성자만 삭제 가능
   */
  const handleDeleteInquiry = async () => {
    if (!selectedInquiryForMenu) return;
    
    try {
      await deleteOutreachInquiry(selectedInquiryForMenu.id);
      
      // 성공 메시지 표시
      showMessage(`"${selectedInquiryForMenu.title}" 문의가 삭제되었습니다.`, 'success');
      
      // 데이터 새로고침
      await Promise.all([
        loadInquiriesData(),
        loadStatsData()
      ]);
      
      handleMoreClose();
      
    } catch (error: any) {
      console.error('문의 삭제 중 오류:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          '문의 삭제 중 오류가 발생했습니다.';
      showMessage(errorMessage, 'error');
    }
  };

  /**
   * 수정 메뉴 클릭 처리
   */
  const handleEditMenuClick = () => {
    if (selectedInquiryForMenu) {
      setSelectedInquiry(selectedInquiryForMenu);
      handleOpenEditForm();
      handleMoreClose();
    }
  };

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: 3 }}>
      {/* 로그인 필요 알림 */}
      {showLoginAlert && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3,
            position: 'fixed',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: 400,
            boxShadow: 3
          }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={goToLoginPage}
              sx={{ fontWeight: 'bold' }}
            >
              로그인하기
            </Button>
          }
        >
          상세 정보를 확인하려면 로그인이 필요합니다.
        </Alert>
      )}

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

      <Box sx={{ 
        display: 'grid',
        gap: 3,
        gridTemplateColumns: '1fr',
        '@media (min-width: 900px)': {
          gridTemplateColumns: '280px 1fr',
        }
      }}>
        {/* 좌측: 빠른 문의 및 연락처 */}
        <Box sx={{ minWidth: 240, maxWidth: 280 }}>
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
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 1 
          }}>
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
          </Box>
        </Box>

        {/* 우측: 문의 목록 */}
        <Box sx={{ minWidth: 750 }}>
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
                    width: '35%',
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
                    width: '15%',
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
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    width: '10%',
                    fontSize: '0.95rem',
                    py: 2,
                    textAlign: 'center'
                  }}>
                    액션
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
                      onContextMenu={(event) => handleMoreClick(event, inquiry)}
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
                      <TableCell>
                        <IconButton
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={(event) => handleMoreClick(event, inquiry)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {loading ? '데이터를 불러오는 중...' : '문의 내역이 없습니다.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 더보기 메뉴 */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMoreClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {selectedInquiryForMenu?.is_owner && (
              <MenuItem onClick={handleEditMenuClick}>
                <ListItemIcon>
                  <Edit fontSize="small" />
                </ListItemIcon>
                <ListItemText>수정</ListItemText>
              </MenuItem>
            )}
            {selectedInquiryForMenu?.is_owner && (
              <MenuItem onClick={handleDeleteInquiry} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <Delete fontSize="small" sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <ListItemText>삭제</ListItemText>
              </MenuItem>
            )}
            {!selectedInquiryForMenu?.is_owner && (
              <MenuItem disabled>
                <ListItemText sx={{ color: 'text.disabled' }}>
                  작성자만 수정/삭제 가능
                </ListItemText>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Box>

      {/* 상세 정보 다이얼로그 */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)', 
          color: 'white',
          fontWeight: 'bold',
          position: 'relative',
          pr: 6  // 오른쪽 패딩 추가 (아이콘 공간 확보)
        }}>
          📋 출강 교육 문의 상세
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        {selectedInquiry && (
          <DialogContent sx={{ p: 3 }}>
            {/* 로딩 상태 표시 */}
            {loading && (
              <Box sx={{ mb: 3 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  상세 정보를 불러오는 중...
                </Alert>
                <LinearProgress />
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                {selectedInquiry.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={selectedInquiry.course_type_display || getCourseTypeName(selectedInquiry.course_type)}
                  color="primary"
                  variant="filled"
                />
                <Chip
                  icon={getStatusIcon(selectedInquiry.status)}
                  label={getStatusName(selectedInquiry.status)}
                  sx={{
                    backgroundColor: getStatusColor(selectedInquiry.status),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Box>

            {/* 연락처 정보 섹션 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                👤 연락처 정보
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: '120px 1fr 120px 1fr'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                  👤 요청자명:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedInquiry.requester_name || '미입력'}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                  📞 연락처:
                </Typography>
                <Typography variant="body1">
                  {selectedInquiry.phone || '미입력'}
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                  📧 이메일:
                </Typography>
                <Typography variant="body1">
                  {selectedInquiry.email || '미입력'}
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                  📍 교육 장소:
                </Typography>
                <Typography variant="body1">
                  {selectedInquiry.location || '미정'}
                </Typography>
              </Box>
            </Box>

            {/* 교육 정보 섹션 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                🎓 교육 정보
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: '120px 1fr 120px 1fr'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                  📚 교육 과정:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedInquiry.course_type_display || getCourseTypeName(selectedInquiry.course_type)}
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                  🎓 학년:
                </Typography>
                <Typography variant="body1">
                  {selectedInquiry.student_grade || '전체'}
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                  👥 참여 인원:
                </Typography>
                <Typography variant="body1">
                  {selectedInquiry.student_count || 0}명
                </Typography>

                {/* 예산 - 값이 있을 때만 표시 */}
                {selectedInquiry.budget && (
                  <>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                      💰 예산:
                    </Typography>
                    <Typography variant="body1">
                      {selectedInquiry.budget.includes('원') 
                        ? selectedInquiry.budget 
                        : `${formatNumberWithCommas(selectedInquiry.budget)}원`
                      }
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            {/* 일정 정보 섹션 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                📅 일정 정보
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: '120px 1fr 120px 1fr'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                  📅 희망 날짜:
                </Typography>
                <Typography variant="body1">
                  {selectedInquiry.preferred_date 
                    ? new Date(selectedInquiry.preferred_date).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })
                    : '미정'
                  }
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                  🕘 희망 시간:
                </Typography>
                <Typography variant="body1">
                  {selectedInquiry.preferred_time || '미정'}
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                  ⏱️ 교육 시간:
                </Typography>
                <Typography variant="body1">
                  {selectedInquiry.duration_display || selectedInquiry.duration || '미정'}
                </Typography>

                {/* 기타 교육 시간이 있을 때만 표시 */}
                {selectedInquiry.duration === '기타' && selectedInquiry.duration_custom && (
                  <>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                      ⏱️ 상세 시간:
                    </Typography>
                    <Typography variant="body1">
                      {selectedInquiry.duration_custom}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 교육 요청사항 - 전체 너비 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                📝 교육 요청사항
              </Typography>
              <Paper sx={{ p: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {selectedInquiry.message || '요청사항이 없습니다.'}
                </Typography>
              </Paper>
            </Box>

            {/* 특별 요청사항 - 값이 있을 때만 표시 */}
            {selectedInquiry.special_requests && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                  ⭐ 특별 요청사항
                </Typography>
                <Paper sx={{ p: 3, backgroundColor: '#f0f8ff', borderRadius: 2 }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {selectedInquiry.special_requests}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* 문의 상태 및 추가 정보 */}
            <Box sx={{ 
              mt: 4, 
              p: 3, 
              backgroundColor: '#f5f5f5', 
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                📊 문의 정보
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '120px 1fr 120px 1fr', 
                gap: 2, 
                mb: 2 
              }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  📊 문의 상태:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip
                    icon={getStatusIcon(selectedInquiry.status)}
                    label={getStatusName(selectedInquiry.status)}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(selectedInquiry.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  🆔 문의 번호:
                </Typography>
                <Typography variant="body2">
                  #{selectedInquiry.id}
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '120px 1fr', 
                gap: 2 
              }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  📅 등록일:
                </Typography>
                <Typography variant="body2">
                  {new Date(selectedInquiry.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </Typography>

                {/* 수정일이 등록일과 다를 때만 표시 */}
                {selectedInquiry.updated_at && 
                 new Date(selectedInquiry.updated_at).getTime() !== new Date(selectedInquiry.created_at).getTime() && (
                  <>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                      🔄 수정일:
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedInquiry.updated_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </Typography>
                  </>
                )}

                {/* 관리자 메모가 있을 때만 표시 */}
                {selectedInquiry.admin_notes && (
                  <>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                      📝 관리자 메모:
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      backgroundColor: '#fff3cd', 
                      p: 1, 
                      borderRadius: 1,
                      border: '1px solid #ffeaa7'
                    }}>
                      {selectedInquiry.admin_notes}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </DialogContent>
        )}
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {selectedInquiry?.is_owner && (
            <Button 
              onClick={handleOpenEditForm}
              variant="contained"
              color="secondary"
              sx={{ ml: 1 }}
            >
              수정하기
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* 새 문의 작성 다이얼로그 */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)', 
          color: 'white',
          fontWeight: 'bold',
          position: 'relative',
          pr: 6
        }}>
          ✏️ 새로운 출강 교육 문의
          <IconButton
            aria-label="close"
            onClick={handleCloseForm}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ minWidth: 800, p: 4 }}>
            {/* 성공 메시지 */}
            {submissionStatus === 'success' && successMessage && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  '& .MuiAlert-message': {
                    fontWeight: 600,
                    fontSize: '1rem'
                  }
                }}
                icon={<CheckCircle />}
              >
                {successMessage}
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                  게시판이 업데이트되었습니다. 잠시 후 창이 자동으로 닫힙니다.
                </Typography>
              </Alert>
            )}

            {/* 오류 메시지 */}
            {submissionStatus === 'error' && successMessage && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  '& .MuiAlert-message': {
                    fontWeight: 600,
                    fontSize: '1rem'
                  }
                }}
              >
                {successMessage}
              </Alert>
            )}

            {/* 제출 중 로딩 */}
            {submissionStatus === 'submitting' && (
              <Box sx={{ mb: 3 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  문의를 등록하고 있습니다...
                </Alert>
                <LinearProgress />
              </Box>
            )}

            {/* 1. 기본 정보 그룹 */}
            <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: '#1976d2', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}>
                  📝 기본 정보
                </Typography>
                
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {/* 교육 제목 */}
                  <TextField
                    fullWidth
                    label="교육 제목"
                    required
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    placeholder="예: 초등학교 3학년 대상 앱 인벤터 교육"
                  />
                  
                  {/* 교육 요청사항 */}
                  <TextField
                    fullWidth
                    label="교육 요청사항"
                    multiline
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleInputChange('message')}
                    placeholder="교육 목적, 학생 수준, 특별한 요구사항 등을 자세히 적어주세요."
                  />
                  
                  {/* 기타 요청사항 */}
                  <TextField
                    fullWidth
                    label="기타 요청사항 (선택사항)"
                    multiline
                    rows={3}
                    value={formData.special_requests}
                    onChange={handleInputChange('special_requests')}
                    placeholder="장비 준비, 추가 교구, 특별한 요구사항 등"
                  />
                </Box>
              </CardContent>
            </Card>

            {/* 2. 연락처 정보 그룹 */}
            <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: '#1976d2', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}>
                  👤 연락처 정보
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }
                }}>
                  <TextField
                    fullWidth
                    label="요청자명"
                    required
                    value={formData.requester_name}
                    onChange={handleInputChange('requester_name')}
                  />
                  
                  <TextField
                    fullWidth
                    label="연락처"
                    required
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    placeholder="010-1234-5678"
                  />
                  
                  <TextField
                    fullWidth
                    label="이메일"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange('email')}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* 3. 교육 설정 그룹 */}
            <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: '#1976d2', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}>
                  🎓 교육 설정
                </Typography>
                
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {/* 첫 번째 행: 희망 과목, 학년, 참여 인원 */}
                  <Box sx={{ 
                    display: 'grid', 
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }
                  }}>
                    <FormControl fullWidth required>
                      <InputLabel>희망 과목</InputLabel>
                      <Select
                        value={formData.course_type}
                        onChange={handleSelectChange('course_type')}
                        label="희망 과목"
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
                    
                    <FormControl fullWidth required>
                      <InputLabel>학년</InputLabel>
                      <Select
                        value={formData.student_grade}
                        onChange={handleSelectChange('student_grade')}
                        label="학년"
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
                    
                    <TextField
                      fullWidth
                      label="참여 인원"
                      type="number"
                      required
                      value={formData.student_count}
                      onChange={handleInputChange('student_count')}
                      inputProps={{ min: 1, max: 100 }}
                      InputProps={{
                        endAdornment: <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>명</Typography>
                      }}
                    />
                  </Box>
                  
                  {/* 두 번째 행: 교육 장소, 예산 */}
                  <Box sx={{ 
                    display: 'grid', 
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }
                  }}>
                    <TextField
                      fullWidth
                      label="교육 장소"
                      required
                      value={formData.location}
                      onChange={handleInputChange('location')}
                      placeholder="예: 서울시 강남구 OO초등학교"
                    />
                    
                    <Box>
                      <TextField
                        fullWidth
                        label="예산 (선택사항)"
                        type="number"
                        value={formData.budget}
                        onChange={handleInputChange('budget')}
                        placeholder="3000000"
                        inputProps={{ 
                          min: 0, 
                          step: 100000 
                        }}
                        InputProps={{
                          endAdornment: <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>원</Typography>
                        }}
                      />
                      {formData.budget && (
                        <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            💰 {formatNumberWithCommas(formData.budget)}원
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                            {convertToKoreanCurrency(parseInt(formData.budget) || 0)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* 4. 일정 설정 그룹 */}
            <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: '#1976d2', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}>
                  📅 일정 설정
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }
                }}>
                  <TextField
                    fullWidth
                    label="희망 날짜"
                    type="date"
                    required
                    value={formData.preferred_date}
                    onChange={handleInputChange('preferred_date')}
                    InputLabelProps={{ shrink: true }}
                  />
                  
                  <TextField
                    fullWidth
                    label="희망 시간"
                    type="time"
                    required
                    value={formData.preferred_time}
                    onChange={handleInputChange('preferred_time')}
                    InputLabelProps={{ shrink: true }}
                  />
                  
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
                </Box>
              </CardContent>
            </Card>
          </DialogContent>
          
          <DialogActions sx={{ px: 4, pb: 3, gap: 2 }}>
            <Button 
              onClick={handleCloseForm} 
              color="secondary"
              disabled={submissionStatus === 'submitting'}
              sx={{ minWidth: 120 }}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={submissionStatus === 'submitting' || submissionStatus === 'success'}
              sx={{ 
                minWidth: 140,
                position: 'relative',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)'
              }}
            >
              {submissionStatus === 'submitting' && (
                <Box
                  component="span"
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <LinearProgress sx={{ width: 20, height: 2 }} />
                </Box>
              )}
              <span style={{ 
                opacity: submissionStatus === 'submitting' ? 0 : 1 
              }}>
                {submissionStatus === 'success' ? '등록 완료!' : 
                 submissionStatus === 'submitting' ? '등록 중...' : 
                 '문의 등록하기'}
              </span>
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* 문의 수정 다이얼로그 */}
      <Dialog 
        open={openEditForm} 
        onClose={handleCloseEditForm}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #f57c00, #ff9800)', 
          color: 'white',
          fontWeight: 'bold',
          position: 'relative',
          pr: 6
        }}>
          ✏️ 출강 교육 문의 수정
          <IconButton
            aria-label="close"
            onClick={handleCloseEditForm}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ minWidth: 800, p: 4 }}>
            {/* 성공 메시지 */}
            {submissionStatus === 'success' && successMessage && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  '& .MuiAlert-message': {
                    fontWeight: 600,
                    fontSize: '1rem'
                  }
                }}
                icon={<CheckCircle />}
              >
                {successMessage}
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                  게시판이 업데이트되었습니다. 잠시 후 창이 자동으로 닫힙니다.
                </Typography>
              </Alert>
            )}

            {/* 제출 중 로딩 */}
            {submissionStatus === 'submitting' && (
              <Box sx={{ mb: 3 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  문의를 수정하고 있습니다...
                </Alert>
                <LinearProgress />
              </Box>
            )}

            {/* 1. 기본 정보 그룹 */}
            <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: '#f57c00', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}>
                  📝 기본 정보
                </Typography>
                
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {/* 교육 제목 */}
                  <TextField
                    fullWidth
                    label="교육 제목"
                    required
                    value={editFormData.title}
                    onChange={handleEditInputChange('title')}
                    placeholder="예: 초등학교 3학년 대상 앱 인벤터 교육"
                  />
                  
                  {/* 교육 요청사항 */}
                  <TextField
                    fullWidth
                    label="교육 요청사항"
                    multiline
                    rows={5}
                    required
                    value={editFormData.message}
                    onChange={handleEditInputChange('message')}
                    placeholder="교육 목적, 학생 수준, 특별한 요구사항 등을 자세히 적어주세요."
                  />
                  
                  {/* 기타 요청사항 */}
                  <TextField
                    fullWidth
                    label="기타 요청사항 (선택사항)"
                    multiline
                    rows={3}
                    value={editFormData.special_requests}
                    onChange={handleEditInputChange('special_requests')}
                    placeholder="장비 준비, 추가 교구, 특별한 요구사항 등"
                  />
                </Box>
              </CardContent>
            </Card>

            {/* 2. 연락처 정보 그룹 */}
            <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: '#f57c00', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}>
                  👤 연락처 정보
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }
                }}>
                  <TextField
                    fullWidth
                    label="요청자명"
                    required
                    value={editFormData.requester_name}
                    onChange={handleEditInputChange('requester_name')}
                  />
                  
                  <TextField
                    fullWidth
                    label="연락처"
                    required
                    value={editFormData.phone}
                    onChange={handleEditInputChange('phone')}
                    placeholder="010-1234-5678"
                  />
                  
                  <TextField
                    fullWidth
                    label="이메일"
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={handleEditInputChange('email')}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* 3. 교육 설정 그룹 */}
            <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: '#f57c00', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}>
                  🎓 교육 설정
                </Typography>
                
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {/* 첫 번째 행: 희망 과목, 학년, 참여 인원 */}
                  <Box sx={{ 
                    display: 'grid', 
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }
                  }}>
                    <FormControl fullWidth required>
                      <InputLabel>희망 과목</InputLabel>
                      <Select
                        value={editFormData.course_type}
                        onChange={handleEditSelectChange('course_type')}
                        label="희망 과목"
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
                    
                    <FormControl fullWidth required>
                      <InputLabel>학년</InputLabel>
                      <Select
                        value={editFormData.student_grade}
                        onChange={handleEditSelectChange('student_grade')}
                        label="학년"
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
                    
                    <TextField
                      fullWidth
                      label="참여 인원"
                      type="number"
                      required
                      value={editFormData.student_count}
                      onChange={handleEditInputChange('student_count')}
                      inputProps={{ min: 1, max: 100 }}
                      InputProps={{
                        endAdornment: <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>명</Typography>
                      }}
                    />
                  </Box>
                  
                  {/* 두 번째 행: 교육 장소, 예산 */}
                  <Box sx={{ 
                    display: 'grid', 
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }
                  }}>
                    <TextField
                      fullWidth
                      label="교육 장소"
                      required
                      value={editFormData.location}
                      onChange={handleEditInputChange('location')}
                      placeholder="예: 서울시 강남구 OO초등학교"
                    />
                    
                    <Box>
                      <TextField
                        fullWidth
                        label="예산 (선택사항)"
                        type="number"
                        value={editFormData.budget}
                        onChange={handleEditInputChange('budget')}
                        placeholder="3000000"
                        inputProps={{ 
                          min: 0, 
                          step: 100000 
                        }}
                        InputProps={{
                          endAdornment: <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>원</Typography>
                        }}
                      />
                      {editFormData.budget && (
                        <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            💰 {formatNumberWithCommas(editFormData.budget)}원
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                            {convertToKoreanCurrency(parseInt(editFormData.budget) || 0)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* 4. 일정 설정 그룹 */}
            <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: '#f57c00', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}>
                  📅 일정 설정
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }
                }}>
                  <TextField
                    fullWidth
                    label="희망 날짜"
                    type="date"
                    required
                    value={editFormData.preferred_date}
                    onChange={handleEditInputChange('preferred_date')}
                    InputLabelProps={{ shrink: true }}
                  />
                  
                  <TextField
                    fullWidth
                    label="희망 시간"
                    type="time"
                    required
                    value={editFormData.preferred_time}
                    onChange={handleEditInputChange('preferred_time')}
                    InputLabelProps={{ shrink: true }}
                  />
                  
                  <FormControl fullWidth required>
                    <InputLabel>교육 시간</InputLabel>
                    <Select
                      value={editFormData.duration}
                      onChange={handleEditSelectChange('duration')}
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
                </Box>
              </CardContent>
            </Card>
          </DialogContent>
          
          <DialogActions sx={{ px: 4, pb: 3, gap: 2 }}>
            <Button 
              onClick={handleCloseEditForm} 
              color="secondary"
              disabled={submissionStatus === 'submitting'}
              sx={{ minWidth: 120 }}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={submissionStatus === 'submitting' || submissionStatus === 'success'}
              sx={{ 
                minWidth: 140,
                position: 'relative',
                background: 'linear-gradient(45deg, #f57c00, #ff9800)'
              }}
            >
              {submissionStatus === 'submitting' && (
                <Box
                  component="span"
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <LinearProgress sx={{ width: 20, height: 2 }} />
                </Box>
              )}
              <span style={{ 
                opacity: submissionStatus === 'submitting' ? 0 : 1 
              }}>
                {submissionStatus === 'success' ? '수정 완료!' : 
                 submissionStatus === 'submitting' ? '수정 중...' : 
                 '문의 수정하기'}
              </span>
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* 중앙 팝업 메시지 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%', minWidth: 300 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 