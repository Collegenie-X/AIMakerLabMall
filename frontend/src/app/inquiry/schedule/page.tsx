'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Paper,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  TextField,
  CardMedia,
  ImageList,
  ImageListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Badge,
  Rating,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Snackbar
} from '@mui/material';
import {
  CalendarMonth,
  AccessTime,
  Group,
  School,
  ArrowForward,
  CheckCircle,
  Place,
  BookmarkAdded,
  BookmarkBorder,
  LocationOn,
  PersonAdd,
  HowToReg,
  DirectionsCar,
  ExpandMore,
  PlayCircleOutline,
  MenuBook,
  EmojiPeople,
  Timer,
  Build,
  Photo,
  PlayArrow,
  VideoLibrary,
  Star,
  ThumbUp,
  Lightbulb,
  CheckCircleOutline,
  Discount,
  LocalOffer,
  Schedule,
  Groups,
  NavigateBefore,
  NavigateNext,
  FiberManualRecord
} from '@mui/icons-material';
import { 
  enrollInClass, 
  type ClassEnrollmentData 
} from '@/services/outreachInquiryService';
import LoginDialog from '@/components/layout/Header/LoginDialog';
import axios from 'axios';

/**
 * 수업 차시 정보 타입
 */
interface LessonPlan {
  session: number;
  title: string;
  duration: string;
  objectives: string[];
  previewVideoUrl?: string; // 미리보기 동영상 URL 추가
}

/**
 * 수강생 후기 타입
 */
interface StudentReview {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
  course: string;
  avatar?: string;
}

/**
 * 난이도 가이드 타입
 */
interface LevelGuide {
  level: '초급' | '중급' | '고급';
  prerequisites: string[];
  skillsGained: string[];
  recommendedFor: string[];
}

/**
 * 할인 정보 타입
 */
interface DiscountInfo {
  type: 'earlybird' | 'group' | 'season';
  title: string;
  description: string;
  discountRate: number;
  condition: string;
  validUntil: string;
  isActive: boolean;
}

/**
 * 교육 일정 타입 정의
 */
interface EducationSchedule {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  instructor: string;
  participants: number;
  maxParticipants: number;
  level: '초급' | '중급' | '고급';
  category: string;
  status: '예정' | '진행중' | '완료';
  classType: '오프라인' | '직접 출강';
  description: string;
  registrationStatus: '미신청' | '신청완료';
  price: number;
  location?: string;
  thumbnail: string;
  lessonPlans: LessonPlan[];
  classImages: string[];
  equipment?: string[];
  targetAge?: string;
  videoUrl?: string;
  reviews?: StudentReview[];
  levelGuide?: LevelGuide;
  discounts?: DiscountInfo[];
  averageRating?: number;
  totalReviews?: number;
}

/**
 * 출강 수업 정보 타입
 */
interface OutreachInfo {
  studentCount: number;
  studentGrade: string;
  duration: string;
  equipment: string[];
  specialRequests: string;
  preferredDate: string;
  preferredTime: string;
}

/**
 * 신청 정보 타입 정의
 */
interface RegistrationInfo {
  scheduleId: string;
  classFormat: '오프라인' | '직접 출강';
  studentName: string;
  phone: string;
  email: string;
  outreachInfo?: OutreachInfo;
}

/**
 * 교육 일정 페이지 컴포넌트
 * AI MAKER LAB의 교육 일정을 확인하고 신청할 수 있는 페이지
 */
export default function EducationSchedulePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentMonth, setCurrentMonth] = useState<string>('2024-03');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<EducationSchedule | null>(null);
  const [registrationInfo, setRegistrationInfo] = useState<RegistrationInfo>({
    scheduleId: '',
    classFormat: '오프라인',
    studentName: '',
    phone: '',
    email: ''
  });
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [curriculumVideoDialog, setCurriculumVideoDialog] = useState(false);
  const [selectedCurriculumVideo, setSelectedCurriculumVideo] = useState<string>('');
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>('');
  const [reviewDialog, setReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  // 추가 상태 관리
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // 로그인 다이얼로그 상태 관리
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');

  /**
   * 프론트엔드 로그인 상태 확인 함수
   * localStorage의 토큰을 확인하여 로그인 상태를 판단합니다.
   */
  const checkLocalAuthStatus = (): { isAuthenticated: boolean; user: any | null } => {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, user: null };
    }

    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        return { isAuthenticated: false, user: null };
      }

      // 간단한 토큰 만료 체크 (JWT 토큰의 경우)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        try {
          const payload = JSON.parse(atob(tokenParts[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (payload.exp && payload.exp < currentTime) {
            // 토큰이 만료됨
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { isAuthenticated: false, user: null };
          }
        } catch (e) {
          // JWT 파싱 실패 시 기본 체크만 수행
          console.warn('JWT 파싱 실패, 기본 인증 체크 수행');
        }
      }

      return { 
        isAuthenticated: true, 
        user: { name: user, email: user } 
      };
    } catch (error) {
      console.error('로그인 상태 확인 중 오류:', error);
      return { isAuthenticated: false, user: null };
    }
  };

  /**
   * 로그인 입력 필드 변경 핸들러
   */
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * 로그인 처리 함수
   */
  const handleLogin = async () => {
    try {
      console.log('로그인 시도:', { email: loginData.email });
      
      const response = await axios.post('http://localhost:8000/api/v1/auth/login/', {
        email: loginData.email,
        password: loginData.password
      });

      console.log('로그인 응답:', response.data);

      if (response.status === 200 && response.data) {
        // 토큰 저장
        localStorage.setItem("token", response.data.tokens.access);
        localStorage.setItem("refresh_token", response.data.tokens.refresh);
        
        // 사용자 정보 저장
        const userName = response.data.user.name || response.data.user.username || response.data.user.email;
        localStorage.setItem("user", userName);
        
        console.log('로그인 성공, 사용자:', userName);
        handleLoginClose();
        
        // 로그인 성공 후 바로 수업 신청 진행
        showMessage('✅ 로그인 성공! 수업 신청을 진행합니다.', 'success');
        
        // 1초 후 수업 신청 처리 (로그인 상태 확인 단계 건너뛰고 바로 신청)
        setTimeout(async () => {
          await proceedWithRegistration();
        }, 1000);
      }
    } catch (err: any) {
      console.error('로그인 에러 상세:', err);
      console.error('에러 응답:', err.response?.data);
      
      let errorMessage = '로그인에 실패했습니다.';
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setLoginError(errorMessage);
    }
  };

  /**
   * 로그인 후 수업 신청 진행 함수
   */
  const proceedWithRegistration = async () => {
    if (!selectedSchedule) {
      showMessage('선택된 수업이 없습니다.', 'error');
      return;
    }

    // 1단계: 입력값 검증
    if (!registrationInfo.studentName || !registrationInfo.phone || !registrationInfo.email) {
      showMessage('모든 필수 정보를 입력해주세요.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      console.log(`📝 수업 신청 시작: ${selectedSchedule.title}`);

      // 2단계: API 데이터 형식 변환
      const enrollmentData: ClassEnrollmentData = {
        class_id: parseInt(selectedSchedule.id),
        requester_name: registrationInfo.studentName,
        phone: registrationInfo.phone,
        email: registrationInfo.email,
        student_count: registrationInfo.outreachInfo?.studentCount || 1,
        message: `[수업신청] ${selectedSchedule.title}`,
        special_requests: registrationInfo.outreachInfo?.specialRequests || ''
      };

      console.log('📤 API 호출 데이터:', enrollmentData);

      // 3단계: 백엔드 API 호출
      const response = await enrollInClass(enrollmentData);
      console.log('✅ 수업 신청 성공:', response);

      // 4단계: 성공 처리
      setScheduleData(prev => 
        prev.map(item => 
          item.id === selectedSchedule.id 
            ? { ...item, registrationStatus: '신청완료', participants: item.participants + 1 }
            : item
        )
      );

      // 5단계: 성공 메시지 표시
      showMessage('🎉 수강 신청이 완료되었습니다! 3초 후 문의 내역을 확인할 수 있습니다.', 'success');
      
      // 6단계: 다이얼로그 닫기
      handleRegistrationClose();
      
      // 7단계: 3초 후 자동으로 /inquiry/contact 페이지로 이동
      setTimeout(() => {
        console.log('📍 문의 내역 페이지로 이동합니다...');
        router.push('/inquiry/contact');
      }, 3000);

      console.log('✅ 수업 신청 처리 완료');

    } catch (error: any) {
      console.error('❌ 수업 신청 중 오류:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          '수업 신청 중 오류가 발생했습니다.';
      
      showMessage(`❌ ${errorMessage}`, 'error');
      
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 로그인 다이얼로그 닫기
   */
  const handleLoginClose = () => {
    setOpenLoginDialog(false);
    setLoginData({ email: '', password: '' });
    setLoginError('');
  };

  /**
   * 회원가입 클릭 핸들러 (임시)
   */
  const handleRegisterClick = () => {
    showMessage('회원가입 기능은 헤더의 로그인 버튼을 이용해주세요.', 'info');
  };

  /**
   * 샘플 교육 일정 데이터 (실제 이미지 및 추가 정보 포함)
   */
  const [scheduleData, setScheduleData] = useState<EducationSchedule[]>([
    {
      id: '7',
      title: '아두이노 기초 및 개발환경 구축',
      date: '2025-07-10',
      time: '14:00',
      duration: '12시간',
      instructor: '김강사',
      participants: 9,
      maxParticipants: 15,
      level: '초급',
      category: '하드웨어',
      status: '예정',
      classType: '오프라인',
      description: '아두이노 보드를 활용한 기초 프로그래밍과 센서 제어를 배웁니다',
      registrationStatus: '미신청',
      price: 120000,
      location: '강남 본원 3층 실습실',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/kR48wdEn6cc',
      averageRating: 4.8,
      totalReviews: 24,
      lessonPlans: [
        { 
          session: 1, 
          title: '아두이노 기초 및 개발환경 구축', 
          duration: '90분', 
          objectives: ['아두이노 보드의 구조와 원리 이해', '아두이노 IDE 설치 및 설정', '기본 회로 구성 방법', '첫 번째 LED 점멸 프로그램'],
          previewVideoUrl: 'https://www.youtube.com/embed/kR48wdEn6cc'
        },
        { 
          session: 2, 
          title: '다양한 센서 연결 및 데이터 수집', 
          duration: '120분', 
          objectives: ['온도/습도 센서 활용', '조도 센서와 LED 제어', '움직임 감지 센서 응용', '센서 데이터 시리얼 모니터링'],
          previewVideoUrl: 'https://www.youtube.com/embed/aircAruvnKk'
        },
        { 
          session: 3, 
          title: 'IoT 프로젝트 제작 및 클라우드 연동', 
          duration: '90분', 
          objectives: ['WiFi 모듈 연결 및 설정', '클라우드 데이터베이스 연동', '스마트홈 시뮬레이션', '프로젝트 발표 및 시연'],
          previewVideoUrl: 'https://www.youtube.com/embed/ZPRIMQP3wy8'
        }
      ],
      classImages: [
        'https://images.unsplash.com/photo-1553062407-6e89abbf09b0?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581093804475-577d72e38aa0?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop'
      ],
      equipment: ['아두이노 우노 보드', '센서 키트 (온도/습도/조도/움직임)', '브레드보드 및 점퍼선', 'USB 케이블', 'WiFi 모듈'],
      targetAge: '중학생 이상',
      levelGuide: {
        level: '초급',
        prerequisites: ['기초 전자회로 이해', '간단한 프로그래밍 경험', '논리적 사고 능력', '영어 단어 이해 능력'],
        skillsGained: ['하드웨어 프로그래밍', 'IoT 개념 및 구현', '센서 데이터 처리', '문제 해결을 위한 AI 활용'],
        recommendedFor: ['메이커 활동에 관심있는 학생', '로봇 공학 지망생', '창의적 문제 해결을 좋아하는 학생', 'STEM 교육에 관심있는 학부모']
      },
      discounts: [
        {
          type: 'season',
          title: '봄 시즌 할인',
          description: '3월 한정 특가 혜택',
          discountRate: 10,
          condition: '3월 중 수강 신청시',
          validUntil: '2024-03-31',
          isActive: true
        }
      ],
      reviews: [
        {
          id: '3',
          studentName: '이준호',
          rating: 5,
          comment: '실제로 센서로 작동하는 걸 보니까 너무 신기했어요! IoT가 이런 거구나 하고 깨달았고, 집에서도 더 만들어보고 싶습니다.',
          date: '2024-02-15',
          course: '아두이노 센서 활용 프로젝트',
          avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face'
        },
        {
          id: '4',
          studentName: '최서연',
          rating: 4,
          comment: '중급 과정이라 조금 어려웠지만, 결과물을 보니 정말 뿌듯했어요. 더 고급 과정도 듣고 싶습니다!',
          date: '2024-02-12',
          course: '아두이노 센서 활용 프로젝트',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7c7?w=100&h=100&fit=crop&crop=face'
        }
      ]
    },
    {
      id: '2',
      title: '아두이노 센서 활용 프로젝트',
      date: '2024-03-18',
      time: '10:00',
      duration: '4시간',
      instructor: '박메이커 강사',
      participants: 8,
      maxParticipants: 12,
      level: '중급',
      category: '하드웨어',
      status: '예정',
      classType: '오프라인',
      description: '다양한 센서를 활용한 스마트 IoT 프로젝트 제작 및 실습',
      registrationStatus: '미신청',
      price: 200000,
      location: '강남 본원 메이커 랩',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/nL34zDTPkcs',
      averageRating: 4.6,
      totalReviews: 18,
      lessonPlans: [
        { 
          session: 1, 
          title: '아두이노 기초 및 개발환경 구축', 
          duration: '90분', 
          objectives: ['아두이노 보드의 구조와 원리 이해', '아두이노 IDE 설치 및 설정', '기본 회로 구성 방법', '첫 번째 LED 점멸 프로그램'],
          previewVideoUrl: 'https://www.youtube.com/embed/kR48wdEn6cc'
        },
        { 
          session: 2, 
          title: '다양한 센서 연결 및 데이터 수집', 
          duration: '120분', 
          objectives: ['온도/습도 센서 활용', '조도 센서와 LED 제어', '움직임 감지 센서 응용', '센서 데이터 시리얼 모니터링'],
          previewVideoUrl: 'https://www.youtube.com/embed/aircAruvnKk'
        },
        { 
          session: 3, 
          title: 'IoT 프로젝트 제작 및 클라우드 연동', 
          duration: '90분', 
          objectives: ['WiFi 모듈 연결 및 설정', '클라우드 데이터베이스 연동', '스마트홈 시뮬레이션', '프로젝트 발표 및 시연'],
          previewVideoUrl: 'https://www.youtube.com/embed/ZPRIMQP3wy8'
        }
      ],
      classImages: [
        'https://images.unsplash.com/photo-1553062407-6e89abbf09b0?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581093804475-577d72e38aa0?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop'
      ],
      equipment: ['아두이노 우노 보드', '센서 키트 (온도/습도/조도/움직임)', '브레드보드 및 점퍼선', 'USB 케이블', 'WiFi 모듈'],
      targetAge: '중학생 이상',
      levelGuide: {
        level: '중급',
        prerequisites: ['기초 전자회로 이해', '간단한 프로그래밍 경험', '논리적 사고 능력', '영어 단어 이해 능력'],
        skillsGained: ['하드웨어 프로그래밍', 'IoT 개념 및 구현', '센서 데이터 처리', '문제 해결을 위한 AI 활용'],
        recommendedFor: ['메이커 활동에 관심있는 학생', '로봇 공학 지망생', '창의적 문제 해결을 좋아하는 학생', 'STEM 교육에 관심있는 학부모']
      },
      discounts: [
        {
          type: 'season',
          title: '봄 시즌 할인',
          description: '3월 한정 특가 혜택',
          discountRate: 10,
          condition: '3월 중 수강 신청시',
          validUntil: '2024-03-31',
          isActive: true
        }
      ],
      reviews: [
        {
          id: '3',
          studentName: '이준호',
          rating: 5,
          comment: '실제로 센서로 작동하는 걸 보니까 너무 신기했어요! IoT가 이런 거구나 하고 깨달았고, 집에서도 더 만들어보고 싶습니다.',
          date: '2024-02-15',
          course: '아두이노 센서 활용 프로젝트',
          avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face'
        },
        {
          id: '4',
          studentName: '최서연',
          rating: 4,
          comment: '중급 과정이라 조금 어려웠지만, 결과물을 보니 정말 뿌듯했어요. 더 고급 과정도 듣고 싶습니다!',
          date: '2024-02-12',
          course: '아두이노 센서 활용 프로젝트',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7c7?w=100&h=100&fit=crop&crop=face'
        }
      ]
    },
    {
      id: '3',
      title: 'AI 머신러닝 입문',
      date: '2024-03-22',
      time: '13:00',
      duration: '6시간',
      instructor: '이코딩 강사',
      participants: 15,
      maxParticipants: 20,
      level: '중급',
      category: 'AI',
      status: '예정',
      classType: '직접 출강',
      description: 'Python을 활용한 머신러닝 기초와 실습 프로젝트',
      registrationStatus: '신청완료',
      price: 250000,
      location: '고객 지정 장소',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
      averageRating: 4.9,
      totalReviews: 32,
      lessonPlans: [
        { 
          session: 1, 
          title: 'AI와 머신러닝 개념 이해', 
          duration: '120분', 
          objectives: ['인공지능의 역사와 발전 과정', '머신러닝의 종류와 특징', '일상생활 속 AI 사례 분석', '머신러닝 프로젝트 설계 방법'],
          previewVideoUrl: 'https://www.youtube.com/embed/kR48wdEn6cc'
        },
        { 
          session: 2, 
          title: 'Python 기초 및 데이터 처리', 
          duration: '150분', 
          objectives: ['Python 기본 문법 및 라이브러리', 'NumPy, Pandas를 활용한 데이터 처리', '데이터 시각화 기초', '실제 데이터셋 다루기'],
          previewVideoUrl: 'https://www.youtube.com/embed/nL34zDTPkcs'
        },
        { 
          session: 3, 
          title: '머신러닝 모델 구현 및 실습', 
          duration: '150분', 
          objectives: ['Scikit-learn을 활용한 모델 구현', '이미지 분류 프로젝트', '예측 모델 성능 평가', '나만의 AI 프로젝트 완성'],
          previewVideoUrl: 'https://www.youtube.com/embed/ZPRIMQP3wy8'
        }
      ],
      classImages: [
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop'
      ],
      equipment: ['개인 노트북 (Windows/Mac)', 'Python 개발환경 (설치 지원)', 'Jupyter Notebook', '실습용 데이터셋', '클라우드 계정'],
      targetAge: '고등학생 이상',
      levelGuide: {
        level: '중급',
        prerequisites: ['Python 기초 문법 이해', '수학적 사고력 (통계 기초)', '논리적 분석 능력', '영어 기술 문서 읽기 가능'],
        skillsGained: ['머신러닝 개념 및 구현', 'AI 모델 개발 기초', '데이터 분석 및 시각화', '문제 해결을 위한 AI 활용'],
        recommendedFor: ['AI 분야 진출 희망자', '데이터 과학에 관심있는 학생', '프로그래밍 심화 학습자', '미래 기술에 관심있는 성인']
      },
      discounts: [
        {
          type: 'group',
          title: '기업 출강 할인',
          description: '5명 이상 기업 출강시 25% 할인',
          discountRate: 25,
          condition: '5명 이상 기업 단체 신청',
          validUntil: '2024-03-20',
          isActive: true
        }
      ],
      reviews: [
        {
          id: '5',
          studentName: '정하늘',
          rating: 5,
          comment: 'AI에 대해 막연하게만 생각했는데, 실제로 모델을 만들어보니 정말 신기했어요! 앞으로도 계속 공부하고 싶습니다.',
          date: '2024-02-10',
          course: 'AI 머신러닝 입문',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        },
        {
          id: '6',
          studentName: '한도현',
          rating: 5,
          comment: '어려운 내용이지만 차근차근 설명해주셔서 이해할 수 있었습니다. 실무에서도 바로 활용할 수 있을 것 같아요!',
          date: '2024-02-08',
          course: 'AI 머신러닝 입문',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
        }
      ]
    },
    {
      id: '4',
      title: 'Raspberry Pi 미니 컴퓨터',
      date: '2024-03-25',
      time: '15:00',
      duration: '3시간',
      instructor: '최하드웨어 강사',
      participants: 6,
      maxParticipants: 10,
      level: '초급',
      category: '하드웨어',
      status: '예정',
      classType: '직접 출강',
      description: '라즈베리파이로 만드는 나만의 미니 컴퓨터 및 IoT 프로젝트',
      registrationStatus: '미신청',
      price: 180000,
      location: '고객 지정 장소',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/ZPRIMQP3wy8',
      averageRating: 4.7,
      totalReviews: 15,
      lessonPlans: [
        { 
          session: 1, 
          title: '라즈베리파이 소개 및 시스템 설정', 
          duration: '60분', 
          objectives: ['라즈베리파이의 역사와 활용 분야', '운영체제 설치 및 초기 설정', '리눅스 기본 명령어', '원격 접속 환경 구축'],
          previewVideoUrl: 'https://www.youtube.com/embed/kR48wdEn6cc'
        },
        { 
          session: 2, 
          title: 'GPIO 핀 제어 및 하드웨어 연결', 
          duration: '80분', 
          objectives: ['GPIO 핀의 역할과 사용법', 'LED 제어 프로그래밍', '버튼 입력 처리', '센서 데이터 읽기'],
          previewVideoUrl: 'https://www.youtube.com/embed/nL34zDTPkcs'
        },
        { 
          session: 3, 
          title: '미니 프로젝트 제작 및 응용', 
          duration: '40분', 
          objectives: ['스마트 알람 시계 제작', '온도 모니터링 시스템', '카메라 모듈 활용', '프로젝트 발표 및 시연'],
          previewVideoUrl: 'https://www.youtube.com/embed/aircAruvnKk'
        }
      ],
      classImages: [
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop'
      ],
      equipment: ['라즈베리파이 4 Model B', 'MicroSD 카드 (32GB)', 'LED 키트 및 저항', '점퍼선 및 브레드보드', '카메라 모듈'],
      targetAge: '초등 5학년 이상',
      levelGuide: {
        level: '초급',
        prerequisites: ['컴퓨터 기본 조작 가능', '간단한 영어 단어 이해', '호기심과 집중력', '기본적인 논리적 사고'],
        skillsGained: ['컴퓨터 하드웨어 원리 이해', '리눅스 기초 명령어', '기초 프로그래밍', '창의적 문제 해결 능력'],
        recommendedFor: ['컴퓨터 내부 구조에 관심있는 학생', 'DIY를 좋아하는 아이들', '메이커 활동 입문자', '창의적 사고를 기르고 싶은 학생']
      },
      discounts: [
        {
          type: 'earlybird',
          title: '3월 얼리버드',
          description: '개강 1주 전 신청시 12% 할인',
          discountRate: 12,
          condition: '2024-03-18 이전 신청',
          validUntil: '2024-03-18',
          isActive: true
        }
      ],
      reviews: [
        {
          id: '7',
          studentName: '신우진',
          rating: 5,
          comment: '작은 컴퓨터로 이런 것도 할 수 있다니! 집에 가서도 더 많은 프로젝트를 만들어보고 싶어요.',
          date: '2024-02-05',
          course: 'Raspberry Pi 미니 컴퓨터',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        {
          id: '8',
          studentName: '오채원',
          rating: 4,
          comment: '처음에는 어려웠지만 선생님이 친절하게 도와주셔서 멋진 프로젝트를 완성할 수 있었어요.',
          date: '2024-02-02',
          course: 'Raspberry Pi 미니 컴퓨터',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7c7?w=100&h=100&fit=crop&crop=face'
        }
      ]
    },
    {
      id: '8',
      title: 'Python 기초 코딩 교육',
      date: '2025-07-17',
      time: '15:30',
      duration: '16시간',
      instructor: '이강사',
      participants: 12,
      maxParticipants: 20,
      level: '중급',
      category: '프로그래밍',
      status: '예정',
      classType: '직접 출강',
      description: 'Python 프로그래밍 언어의 기초부터 실전 프로젝트까지 학습합니다.',
      registrationStatus: '미신청',
      price: 200000,
      location: '서울시 강남구',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
      averageRating: 4.6,
      totalReviews: 18,
      lessonPlans: [
        { 
          session: 1, 
          title: 'Python 기초 이해', 
          duration: '4시간', 
          objectives: ['Python 언어의 기본 개념', '변수와 자료형', '조건문과 반복문', '함수 작성 방법'],
          previewVideoUrl: 'https://www.youtube.com/embed/kR48wdEn6cc'
        },
        { 
          session: 2, 
          title: '데이터 분석을 위한 기초', 
          duration: '6시간', 
          objectives: ['데이터 수집과 전처리', '데이터 시각화 기초', '데이터 분석 도구 소개', '기초 통계 분석'],
          previewVideoUrl: 'https://www.youtube.com/embed/nL34zDTPkcs'
        },
        { 
          session: 3, 
          title: '프로그래밍 심화', 
          duration: '6시간', 
          objectives: ['객체지향 프로그래밍', '예외처리와 모듈', '파일 입출력과 데이터베이스', '실전 프로젝트 기획'],
          previewVideoUrl: 'https://www.youtube.com/embed/ZPRIMQP3wy8'
        }
      ],
      classImages: [
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop'
      ],
      equipment: ['개인 노트북 (Windows/Mac)', 'Python 개발환경 (설치 지원)', 'Jupyter Notebook', '실습용 데이터셋', '클라우드 계정'],
      targetAge: '고등학생 이상',
      levelGuide: {
        level: '중급',
        prerequisites: ['Python 기초 문법 이해', '수학적 사고력 (통계 기초)', '논리적 분석 능력', '영어 기술 문서 읽기 가능'],
        skillsGained: ['머신러닝 개념 및 구현', 'AI 모델 개발 기초', '데이터 분석 및 시각화', '문제 해결을 위한 AI 활용'],
        recommendedFor: ['AI 분야 진출 희망자', '데이터 과학에 관심있는 학생', '프로그래밍 심화 학습자', '미래 기술에 관심있는 성인']
      },
      discounts: [
        {
          type: 'group',
          title: '기업 출강 할인',
          description: '5명 이상 기업 출강시 25% 할인',
          discountRate: 25,
          condition: '5명 이상 기업 단체 신청',
          validUntil: '2024-03-20',
          isActive: true
        }
      ],
      reviews: [
        {
          id: '9',
          studentName: '정하늘',
          rating: 5,
          comment: 'Python 프로그래밍을 배우면서 많은 것을 배웠어요! 실제로 프로젝트를 만들어보니 더욱 흥미로웠습니다.',
          date: '2024-02-10',
          course: 'Python 기초 코딩 교육',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        },
        {
          id: '10',
          studentName: '한도현',
          rating: 4,
          comment: '처음에는 어려웠지만 선생님이 친절하게 도와주셔서 멋진 프로젝트를 완성할 수 있었어요.',
          date: '2024-02-08',
          course: 'Python 기초 코딩 교육',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
        }
      ]
    },
    {
      id: '9',
      title: 'AI 코딩과 머신러닝 입문',
      date: '2025-07-24',
      time: '13:00',
      duration: '20시간',
      instructor: '박박사',
      participants: 10,
      maxParticipants: 12,
      level: '고급',
      category: 'AI',
      status: '예정',
      classType: '오프라인',
      description: 'AI와 머신러닝의 기초 개념부터 실습까지 체계적으로 학습합니다.',
      registrationStatus: '미신청',
      price: 300000,
      location: '강남 본원 AI 실습실',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
      averageRating: 4.9,
      totalReviews: 32,
      lessonPlans: [
        { 
          session: 1, 
          title: 'AI와 머신러닝 개념 이해', 
          duration: '120분', 
          objectives: ['인공지능의 역사와 발전 과정', '머신러닝의 종류와 특징', '일상생활 속 AI 사례 분석', '머신러닝 프로젝트 설계 방법'],
          previewVideoUrl: 'https://www.youtube.com/embed/kR48wdEn6cc'
        },
        { 
          session: 2, 
          title: 'Python 기초 및 데이터 처리', 
          duration: '150분', 
          objectives: ['Python 기본 문법 및 라이브러리', 'NumPy, Pandas를 활용한 데이터 처리', '데이터 시각화 기초', '실제 데이터셋 다루기'],
          previewVideoUrl: 'https://www.youtube.com/embed/nL34zDTPkcs'
        },
        { 
          session: 3, 
          title: '머신러닝 모델 구현 및 실습', 
          duration: '150분', 
          objectives: ['Scikit-learn을 활용한 모델 구현', '이미지 분류 프로젝트', '예측 모델 성능 평가', '나만의 AI 프로젝트 완성'],
          previewVideoUrl: 'https://www.youtube.com/embed/ZPRIMQP3wy8'
        }
      ],
      classImages: [
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop'
      ],
      equipment: ['개인 노트북 (Windows/Mac)', 'Python 개발환경 (설치 지원)', 'Jupyter Notebook', '실습용 데이터셋', '클라우드 계정'],
      targetAge: '고등학생 이상',
      levelGuide: {
        level: '고급',
        prerequisites: ['Python 기초 문법 이해', '수학적 사고력 (통계 기초)', '논리적 분석 능력', '영어 기술 문서 읽기 가능'],
        skillsGained: ['머신러닝 개념 및 구현', 'AI 모델 개발 기초', '데이터 분석 및 시각화', '문제 해결을 위한 AI 활용'],
        recommendedFor: ['AI 분야 진출 희망자', '데이터 과학에 관심있는 학생', '프로그래밍 심화 학습자', '미래 기술에 관심있는 성인']
      },
      discounts: [
        {
          type: 'season',
          title: '여름 특가',
          description: '여름휴가 특가 혜택',
          discountRate: 0,
          condition: '7월 신청시',
          validUntil: '2025-07-31',
          isActive: false
        }
      ],
      reviews: [
        {
          id: '5',
          studentName: '정하늘',
          rating: 5,
          comment: 'AI에 대해 막연하게만 생각했는데, 실제로 모델을 만들어보니 정말 신기했어요! 앞으로도 계속 공부하고 싶습니다.',
          date: '2024-02-10',
          course: 'AI 머신러닝 입문',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        },
        {
          id: '6',
          studentName: '한도현',
          rating: 5,
          comment: '어려운 내용이지만 차근차근 설명해주셔서 이해할 수 있었습니다. 실무에서도 바로 활용할 수 있을 것 같아요!',
          date: '2024-02-08',
          course: 'AI 머신러닝 입문',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
        }
      ]
    }
  ]);

  /**
   * 카테고리 목록
   */
  const categories = ['all', '앱 개발', '하드웨어', 'AI', '메이커'];

  /**
   * 학년 옵션
   */
  const gradeOptions = [
    '초등 1-2학년', '초등 3-4학년', '초등 5-6학년',
    '중학생', '고등학생', '성인', '혼합'
  ];

  /**
   * 레벨별 색상 매핑
   */
  const getLevelColor = (level: string) => {
    switch (level) {
      case '초급': return '#4caf50';
      case '중급': return '#ff9800';
      case '고급': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  /**
   * 상태별 색상 매핑
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case '예정': return '#2196f3';
      case '진행중': return '#ff9800';
      case '완료': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  /**
   * 강의 형태별 아이콘 반환
   */
  const getClassTypeIcon = (classType: string) => {
    switch (classType) {
      case '직접 출강': return <DirectionsCar sx={{ fontSize: 20 }} />;
      case '오프라인': return <LocationOn sx={{ fontSize: 20 }} />;
      default: return <Place sx={{ fontSize: 20 }} />;
    }
  };

  /**
   * 강의 형태별 색상 반환
   */
  const getClassTypeColor = (classType: string) => {
    switch (classType) {
      case '직접 출강': return '#9c27b0';
      case '오프라인': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  /**
   * 신청 상태별 색상 반환
   */
  const getRegistrationStatusColor = (status: string) => {
    switch (status) {
      case '미신청': return '#9e9e9e';
      case '신청완료': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  /**
   * 신청 상태별 아이콘 반환
   */
  const getRegistrationStatusIcon = (status: string) => {
    switch (status) {
      case '신청완료': return <HowToReg />;
      default: return <PersonAdd />;
    }
  };

  /**
   * 필터링된 일정 데이터
   */
  const filteredSchedules = scheduleData.filter(schedule => 
    selectedCategory === 'all' || schedule.category === selectedCategory
  );

  /**
   * 카테고리 선택 핸들러
   */
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  /**
   * 북마크 토글 핸들러
   */
  const handleBookmarkToggle = (scheduleId: string) => {
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(scheduleId)) {
      newBookmarks.delete(scheduleId);
    } else {
      newBookmarks.add(scheduleId);
    }
    setBookmarkedItems(newBookmarks);
  };

  /**
   * 카드 확장 토글 핸들러
   */
  const handleCardExpand = (scheduleId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(scheduleId)) {
      newExpanded.delete(scheduleId);
    } else {
      newExpanded.add(scheduleId);
    }
    setExpandedCards(newExpanded);
  };

  /**
   * 신청/취소 토글 핸들러
   */
  const handleRegistrationToggle = (schedule: EducationSchedule) => {
    if (schedule.registrationStatus === '신청완료') {
      // 취소하기
      setScheduleData(prev => 
        prev.map(item => 
          item.id === schedule.id 
            ? { ...item, registrationStatus: '미신청', participants: Math.max(0, item.participants - 1) }
            : item
        )
      );
    } else {
      // 신청하기 다이얼로그 열기
      handleRegistrationOpen(schedule);
    }
  };

  /**
   * 신청하기 다이얼로그 열기
   */
  const handleRegistrationOpen = (schedule: EducationSchedule) => {
    setSelectedSchedule(schedule);
    setRegistrationInfo({
      scheduleId: schedule.id,
      classFormat: '오프라인', // 기본값을 오프라인으로 설정
      studentName: '',
      phone: '',
      email: '',
      outreachInfo: undefined // 기본값에서는 undefined로 설정
    });
    setOpenDialog(true);
  };

  /**
   * 신청하기 다이얼로그 닫기
   */
  const handleRegistrationClose = () => {
    setOpenDialog(false);
    setSelectedSchedule(null);
  };

  /**
   * 신청 정보 업데이트 - 성능 최적화
   */
  const handleRegistrationInfoChange = useCallback((field: string, value: any) => {
    setRegistrationInfo(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  /**
   * 출강 정보 업데이트 - 성능 최적화
   */
  const handleOutreachInfoChange = useCallback((field: string, value: any) => {
    setRegistrationInfo(prev => ({
      ...prev,
      outreachInfo: {
        ...prev.outreachInfo!,
        [field]: value
      }
    }));
  }, []);

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
   * 리뷰 작성 권한 확인 (수강 완료한 사람만 가능)
   */
  const canWriteReview = (schedule: EducationSchedule): boolean => {
    // 실제로는 사용자의 수강 이력을 확인해야 하지만, 
    // 데모용으로 신청 완료된 강의만 리뷰 작성 가능하도록 함
    return schedule.registrationStatus === '신청완료';
  };

  /**
   * 리뷰 작성 다이얼로그 열기
   */
  const handleReviewDialogOpen = () => {
    setReviewDialog(true);
  };

  /**
   * 리뷰 작성 다이얼로그 닫기
   */
  const handleReviewDialogClose = () => {
    setReviewDialog(false);
    setNewReview({ rating: 0, comment: '' });
  };

  /**
   * 리뷰 제출
   */
  const handleReviewSubmit = () => {
    if (selectedSchedule && newReview.rating > 0 && newReview.comment.trim()) {
      const review: StudentReview = {
        id: Date.now().toString(),
        studentName: registrationInfo.studentName || '익명',
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toLocaleDateString('ko-KR'),
        course: selectedSchedule.title,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      };

      // 스케줄 데이터에 리뷰 추가
      setScheduleData(prev => 
        prev.map(item => 
          item.id === selectedSchedule.id 
            ? { 
                ...item, 
                reviews: [...(item.reviews || []), review],
                totalReviews: (item.totalReviews || 0) + 1,
                averageRating: item.reviews 
                  ? (item.reviews.reduce((sum, r) => sum + r.rating, 0) + newReview.rating) / (item.reviews.length + 1)
                  : newReview.rating
              }
            : item
        )
      );

      handleReviewDialogClose();
    }
  };

  /**
   * 슬라이드 이동 핸들러
   */
  const handleSlideChange = (direction: 'prev' | 'next', schedule: EducationSchedule) => {
    const totalSlides = schedule.classImages.length;
    setCurrentSlide(prev => {
      if (direction === 'prev') {
        return prev === 0 ? totalSlides - 1 : prev - 1;
      } else {
        return prev === totalSlides - 1 ? 0 : prev + 1;
      }
    });
  };

  /**
   * 커리큘럼 동영상 다이얼로그 열기
   */
  const handleCurriculumVideoOpen = (videoUrl: string, lessonTitle: string) => {
    setSelectedCurriculumVideo(videoUrl);
    setSelectedLessonTitle(lessonTitle);
    setCurriculumVideoDialog(true);
  };

  /**
   * 커리큘럼 동영상 다이얼로그 닫기
   */
  const handleCurriculumVideoClose = () => {
    setCurriculumVideoDialog(false);
    setSelectedCurriculumVideo('');
    setSelectedLessonTitle('');
  };

  /**
   * 일정 페이지로 이동 (호환성)
   */
  const handleMoveToSchedule = () => {
    router.push('/inquiry/schedule');
  };

  /**
   * 출장 강의 문의 페이지로 이동 (호환성)
   */
  const handleMoveToContact = () => {
    router.push('/inquiry/contact');
  };

  /**
   * 신청 처리 - 실제 API 호출로 DB에 저장
   * 함수형 모듈형 구조로 순차적 처리 구현
   */
  const handleRegistrationSubmit = async () => {
    if (!selectedSchedule) {
      showMessage('선택된 수업이 없습니다.', 'error');
      return;
    }

    // 0단계: 로그인 상태 확인
    console.log('🔐 로그인 상태 확인 중...');
    try {
      const authStatus = checkLocalAuthStatus();
      if (!authStatus.isAuthenticated) {
        showMessage('🔒 로그인이 필요합니다. 로그인을 진행해주세요.', 'warning');
        setOpenLoginDialog(true);
        return;
      }
      console.log('✅ 로그인 확인 완료:', authStatus.user?.email);
    } catch (error) {
      console.error('❌ 로그인 상태 확인 중 오류:', error);
      showMessage('🔒 로그인 상태 확인에 실패했습니다. 로그인을 진행해주세요.', 'error');
      setOpenLoginDialog(true);
      return;
    }

    // 로그인이 되어있다면 바로 수업 신청 진행
    await proceedWithRegistration();
  };

  /**
   * 할인 가격 계산
   */
  const calculateDiscountPrice = (schedule: EducationSchedule): { originalPrice: number; discountedPrice: number; bestDiscount: DiscountInfo | null } => {
    const activeDiscounts = schedule.discounts?.filter(d => d.isActive) || [];
    if (activeDiscounts.length === 0) {
      return { originalPrice: schedule.price, discountedPrice: schedule.price, bestDiscount: null };
    }

    const bestDiscount = activeDiscounts.reduce((best, current) => 
      current.discountRate > best.discountRate ? current : best
    );

    const discountedPrice = schedule.price * (1 - bestDiscount.discountRate / 100);
    return { originalPrice: schedule.price, discountedPrice, bestDiscount };
  };

  /**
   * 수업 형태 변경 핸들러
   */
  const handleClassFormatChange = (format: '오프라인' | '직접 출강') => {
    setRegistrationInfo(prev => ({
      ...prev,
      classFormat: format,
      outreachInfo: format === '직접 출강' ? {
        studentCount: 20,
        studentGrade: '초등 3-4학년',
        duration: '2시간',
        equipment: [],
        specialRequests: '',
        preferredDate: '',
        preferredTime: ''
      } : undefined
    }));
  };

  return (
    <>
      {/* CSS 애니메이션 정의 */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .video-overlay:hover {
          opacity: 1;
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 페이지 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 6 }} className="fade-in-up">
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            교육 일정
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            다양한 AI와 메이커 교육 프로그램의 일정을 확인하고 
            참여하고 싶은 교육에 신청해보세요.
          </Typography>
        </Box>

        {/* 카테고리 필터 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              교육 분야
            </Typography>
            <Button
              variant="outlined"
              onClick={handleMoveToContact}
              startIcon={<DirectionsCar />}
              sx={{ 
                minWidth: 140,
                borderColor: '#9c27b0',
                color: '#9c27b0',
                '&:hover': {
                  borderColor: '#7b1fa2',
                  backgroundColor: '#f3e5f5'
                }
              }}
            >
              출장 강의
            </Button>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category === 'all' ? '전체' : category}
                onClick={() => handleCategoryChange(category)}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                color={selectedCategory === category ? 'primary' : 'default'}
                sx={{ 
                  mb: 1,
                  fontWeight: selectedCategory === category ? 'bold' : 'normal',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  }
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* 현재 월 정보 */}
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} className="fade-in-up">
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <CalendarMonth sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                2024년 3월
              </Typography>
              <Typography variant="body1">
                총 {filteredSchedules.length}개의 교육 프로그램이 예정되어 있습니다.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* 교육 일정 목록 */}
        <Box 
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,            
            justifyContent: { xs: 'center', md: 'space-between' }
          }}
        >
          {filteredSchedules.map((schedule, index) => {
            const { originalPrice, discountedPrice, bestDiscount } = calculateDiscountPrice(schedule);
            
            return (
              <Box 
                key={schedule.id} 
                sx={{ 
                  flex: { xs: '1 1 100%', sm: '0 0 auto' },
                  maxWidth: { xs: '100%', sm: 340 },
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Card 
                  sx={{ 
                    width: { xs: 320, sm: 340 },
                    height: 380,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    overflow: 'hidden',
                    margin: 0,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      borderColor: '#1976d2'
                    },
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* 썸네일 및 동영상 섹션 - 1:1 비율 */}
                  <Box 
                    sx={{ 
                      position: 'relative', 
                      width: '100%',
                      height: 240,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      backgroundColor: `hsl(${(index * 50) % 360}, 60%, 85%)`
                    }}
                    onClick={() => handleRegistrationOpen(schedule)}
                  >
                    {/* 기본 이미지 대신 카테고리별 아이콘과 색상 */}
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, 
                          ${schedule.category === 'AI' ? '#6a5acd, #483d8b' :
                          schedule.category === '앱 개발' ? '#20b2aa, #008b8b' :
                          schedule.category === '하드웨어' ? '#ff6347, #dc143c' :
                          '#32cd32, #228b22'})`,
                        position: 'relative'
                      }}
                    >
                      {/* 카테고리 아이콘 */}
                      <Box sx={{ color: 'white', opacity: 0.3 }}>
                        {schedule.category === 'AI' && <Lightbulb sx={{ fontSize: 80 }} />}
                        {schedule.category === '앱 개발' && <School sx={{ fontSize: 80 }} />}
                        {schedule.category === '하드웨어' && <Build sx={{ fontSize: 80 }} />}
                        {!['AI', '앱 개발', '하드웨어'].includes(schedule.category) && <MenuBook sx={{ fontSize: 80 }} />}
                      </Box>
                      
                      {/* 오버레이 패턴 */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1)), linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1))',
                          backgroundSize: '20px 20px',
                          backgroundPosition: '0 0, 10px 10px'
                        }}
                      />
                    </Box>
                    
                    {/* 베스트셀러/인기 강의 배지 */}
                    {schedule.averageRating && schedule.averageRating >= 4.5 && (
                      <Chip
                        label="베스트셀러"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          backgroundColor: '#f57c00',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                    )}
                    
                    {/* 할인 배지 */}
                    {bestDiscount && (
                      <Chip
                        label={`-${bestDiscount.discountRate}%`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                    )}
                    
                    {/* 동영상 미리보기 호버 오버레이 - 카드 클릭으로만 상세보기 */}
                    {schedule.videoUrl && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          '&:hover': {
                            opacity: 1
                          }
                        }}
                      >
                        <Box sx={{ textAlign: 'center', color: 'white' }}>
                          <PlayArrow sx={{ fontSize: 40, mb: 1 }} />
                          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                            클릭하여 상세보기
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* 수강 시간 배지 */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        {schedule.duration}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ 
                    p: 1.5, 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    '&:last-child': { pb: 1.5 }
                  }}>
                    {/* 제목 */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        lineHeight: 1.2,
                        mb: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.4em'
                      }}
                    >
                      {schedule.title}
                    </Typography>
                    
                    {/* 강사 정보 */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        fontSize: '0.75rem',
                        mb: 1
                      }}
                    >
                      {schedule.instructor}
                    </Typography>

                    {/* 평점 및 리뷰 */}
                    {schedule.averageRating && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: '#b4690e',
                            mr: 0.5,
                            fontSize: '0.8rem'
                          }}
                        >
                          {schedule.averageRating.toFixed(1)}
                        </Typography>
                        <Rating 
                          value={schedule.averageRating} 
                          readOnly 
                          size="small" 
                          precision={0.1}
                          sx={{ mr: 0.5, '& .MuiRating-icon': { fontSize: '0.9rem' } }}
                        />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: '0.7rem' }}
                        >
                          ({schedule.totalReviews?.toLocaleString()})
                        </Typography>
                      </Box>
                    )}

                    {/* 레벨과 카테고리 - 수평 배치 */}
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={schedule.level}
                        size="small"
                        sx={{
                          backgroundColor: getLevelColor(schedule.level),
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.65rem',
                          height: 18
                        }}
                      />
                      <Chip
                        icon={getClassTypeIcon(schedule.classType)}
                        label={schedule.classType}
                        size="small"
                        sx={{
                          backgroundColor: getClassTypeColor(schedule.classType),
                          color: 'white',
                          fontSize: '0.65rem',
                          height: 18,
                          '& .MuiChip-icon': {
                            fontSize: 10
                          }
                        }}
                      />
                    </Box>

                    {/* 수강 정보 바 - 컴팩트 */}
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          {schedule.participants}/{schedule.maxParticipants}명
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          {Math.round((schedule.participants / schedule.maxParticipants) * 100)}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(schedule.participants / schedule.maxParticipants) * 100}
                        sx={{ 
                          height: 3, 
                          borderRadius: 2,
                          backgroundColor: '#f0f0f0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 2,
                            backgroundColor: schedule.participants >= schedule.maxParticipants ? '#f44336' : '#4caf50'
                          }
                        }}
                      />
                    </Box>

                    {/* 푸터 영역 */}
                    <Box sx={{ mt: 'auto' }}>
                      {/* 가격 정보 - 좌우 배치 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {bestDiscount ? (
                            <>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  color: '#d32f2f',
                                  fontSize: '1rem'
                                }}
                              >
                                ₩{Math.round(discountedPrice).toLocaleString()}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  textDecoration: 'line-through', 
                                  color: 'text.secondary',
                                  fontSize: '0.75rem'
                                }}
                              >
                                ₩{originalPrice.toLocaleString()}
                              </Typography>
                            </>
                          ) : (
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: '#1976d2',
                                fontSize: '1rem'
                              }}
                            >
                              ₩{schedule.price.toLocaleString()}
                            </Typography>
                          )}
                        </Box>

                        {/* 북마크 아이콘 */}
                        <Tooltip title="북마크">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookmarkToggle(schedule.id);
                            }}
                            sx={{ 
                              transition: 'transform 0.2s ease',
                              '&:hover': {
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            {bookmarkedItems.has(schedule.id) ? 
                              <BookmarkAdded color="primary" fontSize="small" /> : 
                              <BookmarkBorder color="action" fontSize="small" />
                            }
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {/* 액션 버튼 */}
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegistrationToggle(schedule);
                        }}
                        disabled={schedule.registrationStatus === '미신청' && schedule.participants >= schedule.maxParticipants}
                        sx={{
                          background: schedule.registrationStatus === '신청완료' 
                            ? 'linear-gradient(45deg, #f44336, #ff6659)'
                            : 'linear-gradient(45deg, #1976d2, #42a5f5)',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          py: 0.8,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: schedule.registrationStatus === '신청완료'
                              ? 'linear-gradient(45deg, #d32f2f, #f44336)'
                              : 'linear-gradient(45deg, #1565c0, #1976d2)',
                            transform: 'translateY(-1px)',
                            boxShadow: 3
                          },
                          '&:disabled': {
                            background: '#ccc',
                            color: '#666'
                          }
                        }}
                      >
                        {schedule.participants >= schedule.maxParticipants ? '마감' :
                         schedule.registrationStatus === '신청완료' ? '취소하기' : '신청하기'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>

        {/* 신청 안내 */}
        <Box sx={{ mt: 6 }} className="fade-in-up">
          <Card sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                교육 신청 안내
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                모든 교육은 사전 신청제로 운영됩니다. 
                오프라인 수업과 직접 출강 서비스를 제공합니다.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
                <Chip icon={<LocationOn />} label="오프라인 수업" color="success" />
                <Chip icon={<DirectionsCar />} label="직접 출강" color="secondary" />
                <Chip icon={<VideoLibrary />} label="동영상 미리보기" color="info" />
                <Chip icon={<Star />} label="수강생 후기" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* 신청 다이얼로그 */}
        <Dialog 
          open={openDialog} 
          onClose={handleRegistrationClose} 
          maxWidth="lg" 
          fullWidth
          PaperProps={{
            sx: { 
              borderRadius: 2,
              overflow: 'hidden',
              maxHeight: '95vh'
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            py: 2,
            pb: 0
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              교육 신청
            </Typography>
            {selectedSchedule && (
              <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
                {selectedSchedule.title}
              </Typography>
            )}
          </DialogTitle>

          {/* 썸네일/동영상 섹션 */}
          {selectedSchedule && (
            <Box sx={{ position: 'relative', backgroundColor: '#667eea', height: 300 }}>
              {/* 이미지 슬라이드 */}
              <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                <Box
                  sx={{
                    display: 'flex',
                    transition: 'transform 0.5s ease-in-out',
                    transform: `translateX(-${currentSlide * 100}%)`,
                    height: '100%'
                  }}
                >
                  {selectedSchedule.classImages.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        minWidth: '100%',
                        height: '100%',
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                      }}
                    >
                      {/* 오버레이 */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))'
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                {/* 슬라이드 네비게이션 버튼 */}
                <IconButton
                  onClick={() => handleSlideChange('prev', selectedSchedule)}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    '&:hover': {
                      backgroundColor: 'white',
                      transform: 'translateY(-50%) scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <NavigateBefore />
                </IconButton>
                
                <IconButton
                  onClick={() => handleSlideChange('next', selectedSchedule)}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    '&:hover': {
                      backgroundColor: 'white',
                      transform: 'translateY(-50%) scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <NavigateNext />
                </IconButton>

                {/* 슬라이드 인디케이터 */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1
                  }}
                >
                  {selectedSchedule.classImages.map((_, index) => (
                    <FiberManualRecord
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      sx={{
                        fontSize: 12,
                        color: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: 'white',
                          transform: 'scale(1.2)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
              
              {/* 메인 동영상 재생 버튼 - 제거됨 */}
              
              {/* 평점 표시 */}
              {selectedSchedule.averageRating && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 3,
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    boxShadow: 3,
                    zIndex: 10
                  }}
                >
                  <Star sx={{ color: '#ffc107', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {selectedSchedule.averageRating.toFixed(1)} ({selectedSchedule.totalReviews})
                  </Typography>
                </Box>
              )}

              {/* 코스 정보 오버레이 */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  borderRadius: 2,
                  p: 2,
                  minWidth: 200,
                  zIndex: 10
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {selectedSchedule.title}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {selectedSchedule.instructor} • {selectedSchedule.duration}
                </Typography>
              </Box>
            </Box>
          )}

          <DialogContent sx={{ p: 0 }}>
            {selectedSchedule && (
              <>
                <Box sx={{ display: 'flex', minHeight: '400px' }}>
                  {/* 좌측: 신청자 정보 */}
                  <Box sx={{ width: '40%', p: 3, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      mb: 3
                    }}>
                      <PersonAdd sx={{ mr: 1, color: '#1976d2' }} />
                      신청자 정보
                    </Typography>
                    
                    <Stack spacing={3}>
                      <TextField
                        label="실명"
                        value={registrationInfo.studentName}
                        onChange={(e) => handleRegistrationInfoChange('studentName', e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        size="medium"
                        placeholder="홍길동"
                      />
                      <TextField
                        label="연락받을 전화번호"
                        value={registrationInfo.phone}
                        onChange={(e) => handleRegistrationInfoChange('phone', e.target.value)}
                        fullWidth
                        required
                        placeholder="010-1234-5678"
                        variant="outlined"
                        size="medium"
                      />
                      <TextField
                        label="연락받을 이메일"
                        type="email"
                        value={registrationInfo.email}
                        onChange={(e) => handleRegistrationInfoChange('email', e.target.value)}
                        fullWidth
                        required
                        placeholder="example@email.com"
                        variant="outlined"
                        size="medium"
                      />
                      
                      <FormControl fullWidth>
                        <InputLabel>수업 형태</InputLabel>
                        <Select
                          value={registrationInfo.classFormat}
                          onChange={(e) => handleClassFormatChange(e.target.value as '오프라인' | '직접 출강')}
                          label="수업 형태"
                          size="medium"
                        >
                          <MenuItem value="오프라인">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationOn sx={{ mr: 1, color: '#4caf50' }} />
                              오프라인 수업 (본원 방문)
                            </Box>
                          </MenuItem>
                          <MenuItem value="직접 출강">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <DirectionsCar sx={{ mr: 1, color: '#9c27b0' }} />
                              직접 출강 (강사 파견)
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>

                      {/* 출강 수업 추가 정보 */}
                      {registrationInfo.classFormat === '직접 출강' && (
                        <Paper sx={{ p: 3, backgroundColor: '#fff3e0', borderRadius: 2, border: '2px solid #ffb74d' }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ 
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            color: '#e65100'
                          }}>
                            <DirectionsCar sx={{ mr: 1 }} />
                            출강 수업 추가 정보
                          </Typography>
                          <Stack spacing={2}>
                            <TextField
                              label="학생 수"
                              type="number"
                              value={registrationInfo.outreachInfo?.studentCount || ''}
                              onChange={(e) => handleOutreachInfoChange('studentCount', parseInt(e.target.value))}
                              fullWidth
                              required
                              inputProps={{ min: 1, max: 50 }}
                              helperText="최소 1명, 최대 50명"
                              size="small"
                            />
                            <FormControl fullWidth required size="small">
                              <InputLabel>학년/연령대</InputLabel>
                              <Select
                                value={registrationInfo.outreachInfo?.studentGrade || ''}
                                onChange={(e) => handleOutreachInfoChange('studentGrade', e.target.value)}
                                label="학년/연령대"
                              >
                                {gradeOptions.map((grade) => (
                                  <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <TextField
                              label="희망 수업 시간"
                              value={registrationInfo.outreachInfo?.duration || ''}
                              onChange={(e) => handleOutreachInfoChange('duration', e.target.value)}
                              fullWidth
                              required
                              placeholder="예: 2시간, 4시간"
                              size="small"
                            />
                            <TextField
                              label="특별 요청사항"
                              multiline
                              rows={2}
                              value={registrationInfo.outreachInfo?.specialRequests || ''}
                              onChange={(e) => handleOutreachInfoChange('specialRequests', e.target.value)}
                              fullWidth
                              placeholder="추가 요청사항이 있으시면 입력해주세요"
                              size="small"
                            />
                          </Stack>
                        </Paper>
                      )}
                    </Stack>
                  </Box>

                  {/* 우측: 교육 상세 정보 */}
                  <Box sx={{ width: '60%', p: 3, overflow: 'auto' }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      mb: 3,
                      color: '#6a1b9a'
                    }}>
                      <School sx={{ mr: 1 }} />
                      교육 상세 정보
                    </Typography>

                    {/* 기본 교육 정보 */}
                    <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f3e5f5', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CalendarMonth sx={{ color: '#1976d2', fontSize: 18 }} />
                            <Typography variant="body2">
                              <strong>일시:</strong> {new Date(selectedSchedule.date).toLocaleDateString('ko-KR')} {selectedSchedule.time}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AccessTime sx={{ color: '#1976d2', fontSize: 18 }} />
                            <Typography variant="body2">
                              <strong>시간:</strong> {selectedSchedule.duration}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <School sx={{ color: '#1976d2', fontSize: 18 }} />
                            <Typography variant="body2">
                              <strong>강사:</strong> {selectedSchedule.instructor}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Place sx={{ color: '#1976d2', fontSize: 18 }} />
                            <Typography variant="body2">
                              <strong>장소:</strong> {selectedSchedule.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>

                    {/* 수강료 정보 */}
                    <Paper sx={{ p: 2, mb: 3, backgroundColor: '#e8f5e8', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        💰 수강료
                      </Typography>
                      {(() => {
                        const { originalPrice, discountedPrice, bestDiscount } = calculateDiscountPrice(selectedSchedule);
                        return bestDiscount ? (
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                            <Typography 
                              variant="body2" 
                              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                            >
                              ₩ {originalPrice.toLocaleString()}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                              ₩ {Math.round(discountedPrice).toLocaleString()}
                            </Typography>
                            <Chip
                              label={`${bestDiscount.discountRate}% 할인!`}
                              size="small"
                              color="error"
                              variant="filled"
                            />
                          </Stack>
                        ) : (
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                            ₩ {selectedSchedule.price.toLocaleString()}
                          </Typography>
                        );
                      })()}
                    </Paper>

                    {/* 차시별 교육 커리큘럼 */}
                    <Paper sx={{ p: 2, mb: 3, backgroundColor: '#fff3e0', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                        <MenuBook sx={{ fontSize: 18, mr: 1, color: '#ff9800' }} />
                        차시별 교육 커리큘럼
                      </Typography>
                      {selectedSchedule.lessonPlans.map((lesson, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid #ffcc02' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e65100', mb: 1 }}>
                                {lesson.session}차시: {lesson.title} ({lesson.duration})
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {lesson.objectives.map((objective, objIndex) => (
                                  <Chip
                                    key={objIndex}
                                    label={objective}
                                    size="small"
                                    variant="outlined"
                                    color="warning"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                  />
                                ))}
                              </Box>
                            </Box>
                            
                            {/* 미리보기 버튼 */}
                            {lesson.previewVideoUrl && (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<PlayCircleOutline />}
                                onClick={() => handleCurriculumVideoOpen(lesson.previewVideoUrl!, lesson.title)}
                                sx={{
                                  ml: 2,
                                  borderColor: '#ff9800',
                                  color: '#ff9800',
                                  fontWeight: 'bold',
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1.5,
                                  py: 0.5,
                                  '&:hover': {
                                    backgroundColor: '#fff3e0',
                                    borderColor: '#f57c00',
                                    color: '#f57c00',
                                    transform: 'scale(1.05)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                미리보기
                              </Button>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Paper>

                    {/* 준비 교구재 */}
                    <Paper sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Build sx={{ fontSize: 18, mr: 1, color: '#1976d2' }} />
                        준비 교구재
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {selectedSchedule.equipment?.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            size="small"
                            variant="filled"
                            color="primary"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ))}
                      </Stack>
                    </Paper>
                  </Box>
                </Box>

                {/* 하단: 수강생 후기 섹션 */}
                <Box sx={{ p: 3, backgroundColor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ fontSize: 20, mr: 1, color: '#ffc107' }} />
                      수강생 후기 ({selectedSchedule.totalReviews || 0}개)
                    </Typography>
                    
                    {canWriteReview(selectedSchedule) && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleReviewDialogOpen}
                        sx={{
                          background: 'linear-gradient(45deg, #ff9800, #ffb74d)',
                          fontWeight: 'bold',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #f57c00, #ff9800)'
                          }
                        }}
                      >
                        리뷰 작성
                      </Button>
                    )}
                  </Box>

                  {selectedSchedule.reviews && selectedSchedule.reviews.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {selectedSchedule.reviews.slice(0, 4).map((review) => (
                        <Box key={review.id} sx={{ width: 'calc(50% - 8px)' }}>
                          <Paper sx={{ p: 2, backgroundColor: 'white', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Avatar 
                                src={review.avatar} 
                                sx={{ width: 32, height: 32, mr: 1 }}
                              >
                                {review.studentName[0]}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {review.studentName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Rating value={review.rating} readOnly size="small" />
                                  <Typography variant="caption" color="text.secondary">
                                    {review.date}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                              {review.comment}
                            </Typography>
                          </Paper>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: 'white' }}>
                      <Typography variant="body2" color="text.secondary">
                        아직 작성된 후기가 없습니다.
                        {canWriteReview(selectedSchedule) && ' 첫 번째 후기를 작성해보세요!'}
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ 
            p: 3, 
            backgroundColor: '#f5f5f5',
            justifyContent: 'flex-end',
            gap: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Button 
              onClick={handleRegistrationClose}
              size="large"
              variant="outlined"
              sx={{ 
                px: 3,
                py: 1,
                color: '#666',
                borderColor: '#ddd',
                '&:hover': {
                  borderColor: '#999',
                  backgroundColor: '#f9f9f9'
                }
              }}
            >
              취소
            </Button>
            <Button 
              onClick={handleRegistrationSubmit}
              variant="contained"
              disabled={submitting}
              sx={{
                background: submitting 
                  ? 'linear-gradient(45deg, #ccc, #aaa)' 
                  : 'linear-gradient(45deg, #1976d2, #42a5f5)',
                '&:hover': {
                  background: submitting 
                    ? 'linear-gradient(45deg, #ccc, #aaa)' 
                    : 'linear-gradient(45deg, #1565c0, #1976d2)',
                  transform: submitting ? 'none' : 'translateY(-1px)',
                  boxShadow: submitting ? 'none' : 3
                },
                transition: 'all 0.2s ease',
                position: 'relative',
                minWidth: 120
              }}
            >
              {submitting ? (
                <>
                  <LinearProgress 
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      backgroundColor: 'transparent',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)'
                      }
                    }} 
                  />
                  신청 중...
                </>
              ) : (
                '신청하기'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* 리뷰 작성 다이얼로그 */}
        <Dialog 
          open={reviewDialog} 
          onClose={handleReviewDialogClose} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: { 
              borderRadius: 2
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
            color: 'white',
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              수강 후기 작성
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  별점
                </Typography>
                <Rating
                  value={newReview.rating}
                  onChange={(event, newValue) => {
                    setNewReview(prev => ({ ...prev, rating: newValue || 0 }));
                  }}
                  size="large"
                  precision={1}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  후기 내용
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  fullWidth
                  placeholder="수강하신 교육에 대한 솔직한 후기를 남겨주세요."
                  variant="outlined"
                  inputProps={{ maxLength: 300 }}
                  helperText={`${newReview.comment.length}/300자`}
                />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleReviewDialogClose}>
              취소
            </Button>
            <Button 
              onClick={handleReviewSubmit}
              variant="contained"
              disabled={newReview.rating === 0 || newReview.comment.trim().length === 0}
              sx={{
                background: 'linear-gradient(45deg, #ff9800, #ffb74d)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #f57c00, #ff9800)'
                }
              }}
            >
              후기 등록
            </Button>
          </DialogActions>
        </Dialog>

        {/* 커리큘럼 동영상 다이얼로그 */}
        <Dialog 
          open={curriculumVideoDialog} 
          onClose={handleCurriculumVideoClose} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { 
              backgroundColor: '#000',
              borderRadius: 2,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: 'white', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
            py: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              📚 {selectedLessonTitle}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              커리큘럼 미리보기
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 0, backgroundColor: '#000' }}>
            <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={selectedCurriculumVideo}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedLessonTitle}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#000', justifyContent: 'center', py: 2 }}>
            <Button 
              onClick={handleCurriculumVideoClose}
              variant="contained"
              sx={{ 
                background: 'linear-gradient(45deg, #ff9800, #ffb74d)',
                color: 'white',
                fontWeight: 'bold',
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(45deg, #f57c00, #ff9800)',
                  transform: 'translateY(-1px)',
                  boxShadow: 3
                },
                transition: 'all 0.2s ease'
              }}
            >
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* 성공/오류 메시지 스낵바 */}
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
          sx={{ 
            width: '100%', 
            minWidth: 300,
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* 로그인 다이얼로그 */}
      <LoginDialog
        open={openLoginDialog}
        onClose={handleLoginClose}
        loginData={loginData}
        error={loginError}
        onInputChange={handleLoginInputChange}
        onLogin={handleLogin}
        onRegisterClick={handleRegisterClick}
        setError={setLoginError}
      />
    </>
  );
} 