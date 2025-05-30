'use client';

import { useState } from 'react';
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
  Badge,
  LinearProgress
} from '@mui/material';
import {
  CalendarMonth,
  AccessTime,
  Group,
  School,
  ArrowForward,
  CheckCircle,
  SwapHoriz,
  Place,
  BookmarkAdded,
  BookmarkBorder,
  VideoCall,
  LocationOn,
  PersonAdd,
  HowToReg
} from '@mui/icons-material';

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
  classType: '온라인' | '오프라인' | '하이브리드';
  description: string;
  registrationStatus: '미신청' | '신청예정' | '신청완료' | '수강중' | '수료';
  price: number;
  location?: string;
}

/**
 * 신청 정보 타입 정의
 */
interface RegistrationInfo {
  scheduleId: string;
  classFormat: '온라인' | '오프라인';
  studentName: string;
  phone: string;
  email: string;
}

/**
 * 교육 일정 페이지 컴포넌트
 * AI MAKER LAB의 교육 일정을 확인하고 신청할 수 있는 페이지
 */
export default function EducationSchedulePage() {
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

  /**
   * 샘플 교육 일정 데이터
   */
  const [scheduleData, setScheduleData] = useState<EducationSchedule[]>([
    {
      id: '1',
      title: '앱 인벤터 기초 과정',
      date: '2024-03-15',
      time: '14:00',
      duration: '3시간',
      instructor: '김AI 강사',
      participants: 12,
      maxParticipants: 15,
      level: '초급',
      category: '앱 개발',
      status: '예정',
      classType: '하이브리드',
      description: '스마트폰 앱 개발의 첫걸음, 블록 코딩으로 쉽게 배우는 앱 인벤터',
      registrationStatus: '신청예정',
      price: 150000,
      location: '강남 본원 3층 실습실'
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
      description: '다양한 센서를 활용한 스마트 IoT 프로젝트 제작',
      registrationStatus: '미신청',
      price: 200000,
      location: '강남 본원 메이커 랩'
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
      classType: '온라인',
      description: 'Python을 활용한 머신러닝 기초와 실습 프로젝트',
      registrationStatus: '신청완료',
      price: 250000
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
      classType: '하이브리드',
      description: '라즈베리파이로 만드는 나만의 미니 컴퓨터',
      registrationStatus: '수강중',
      price: 180000,
      location: '강남 본원 하드웨어 랩'
    }
  ]);

  /**
   * 카테고리 목록
   */
  const categories = ['all', '앱 개발', '하드웨어', 'AI', '메이커'];

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
      case '온라인': return <VideoCall sx={{ fontSize: 20 }} />;
      case '오프라인': return <LocationOn sx={{ fontSize: 20 }} />;
      case '하이브리드': return <SwapHoriz sx={{ fontSize: 20 }} />;
      default: return <Place sx={{ fontSize: 20 }} />;
    }
  };

  /**
   * 강의 형태별 색상 반환
   */
  const getClassTypeColor = (classType: string) => {
    switch (classType) {
      case '온라인': return '#9c27b0';
      case '오프라인': return '#4caf50';
      case '하이브리드': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  /**
   * 신청 상태별 색상 반환
   */
  const getRegistrationStatusColor = (status: string) => {
    switch (status) {
      case '미신청': return '#9e9e9e';
      case '신청예정': return '#2196f3';
      case '신청완료': return '#4caf50';
      case '수강중': return '#ff9800';
      case '수료': return '#9c27b0';
      default: return '#9e9e9e';
    }
  };

  /**
   * 신청 상태별 아이콘 반환
   */
  const getRegistrationStatusIcon = (status: string) => {
    switch (status) {
      case '신청예정': return <BookmarkAdded />;
      case '신청완료': return <HowToReg />;
      case '수강중': return <School />;
      case '수료': return <CheckCircle />;
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
   * 신청하기 다이얼로그 열기
   */
  const handleRegistrationOpen = (schedule: EducationSchedule) => {
    setSelectedSchedule(schedule);
    setRegistrationInfo({
      scheduleId: schedule.id,
      classFormat: schedule.classType === '온라인' ? '온라인' : '오프라인',
      studentName: '',
      phone: '',
      email: ''
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
   * 신청 처리
   */
  const handleRegistrationSubmit = () => {
    if (selectedSchedule) {
      // 신청 상태 업데이트
      setScheduleData(prev => 
        prev.map(item => 
          item.id === selectedSchedule.id 
            ? { ...item, registrationStatus: '신청완료', participants: item.participants + 1 }
            : item
        )
      );
      handleRegistrationClose();
    }
  };

  /**
   * 신청 상태 변경 핸들러
   */
  const handleStatusChange = (scheduleId: string, newStatus: EducationSchedule['registrationStatus']) => {
    setScheduleData(prev => 
      prev.map(item => 
        item.id === scheduleId 
          ? { ...item, registrationStatus: newStatus }
          : item
      )
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
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
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          교육 분야
        </Typography>
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
                fontWeight: selectedCategory === category ? 'bold' : 'normal'
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* 현재 월 정보 */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
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
      <Grid container spacing={3}>
        {filteredSchedules.map((schedule) => (
          <Grid item xs={12} md={6} key={schedule.id}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                },
                border: schedule.registrationStatus === '신청예정' ? '2px solid #2196f3' : 'none'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* 카드 헤더 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {schedule.title}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => handleBookmarkToggle(schedule.id)}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        {bookmarkedItems.has(schedule.id) ? 
                          <BookmarkAdded color="primary" /> : 
                          <BookmarkBorder color="action" />
                        }
                      </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {schedule.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                    <Chip
                      label={schedule.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(schedule.status),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                    <Badge
                      badgeContent={schedule.registrationStatus === '신청예정' ? '예정' : ''}
                      color="primary"
                    >
                      <Chip
                        icon={getRegistrationStatusIcon(schedule.registrationStatus)}
                        label={schedule.registrationStatus}
                        size="small"
                        sx={{
                          backgroundColor: getRegistrationStatusColor(schedule.registrationStatus),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Badge>
                  </Box>
                </Box>

                {/* 교육 정보 */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarMonth sx={{ fontSize: 20, mr: 1, color: '#1976d2' }} />
                    <Typography variant="body2">
                      {new Date(schedule.date).toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTime sx={{ fontSize: 20, mr: 1, color: '#1976d2' }} />
                    <Typography variant="body2">
                      {schedule.time} ({schedule.duration})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <School sx={{ fontSize: 20, mr: 1, color: '#1976d2' }} />
                    <Typography variant="body2">
                      {schedule.instructor}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Group sx={{ fontSize: 20, mr: 1, color: '#1976d2' }} />
                    <Typography variant="body2">
                      {schedule.participants}/{schedule.maxParticipants}명
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(schedule.participants / schedule.maxParticipants) * 100}
                      sx={{ ml: 2, flex: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ color: getClassTypeColor(schedule.classType), mr: 1 }}>
                      {getClassTypeIcon(schedule.classType)}
                    </Box>
                    <Typography variant="body2">
                      {schedule.classType}
                      {schedule.location && ` • ${schedule.location}`}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      ₩ {schedule.price.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* 카드 푸터 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={schedule.level}
                      size="small"
                      sx={{
                        backgroundColor: getLevelColor(schedule.level),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                    <Chip
                      label={schedule.category}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {schedule.registrationStatus !== '미신청' && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          const statuses: EducationSchedule['registrationStatus'][] = ['미신청', '신청예정', '신청완료', '수강중', '수료'];
                          const currentIndex = statuses.indexOf(schedule.registrationStatus);
                          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                          handleStatusChange(schedule.id, nextStatus);
                        }}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        상태변경
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<ArrowForward />}
                      onClick={() => handleRegistrationOpen(schedule)}
                      disabled={schedule.registrationStatus === '신청완료' || schedule.participants >= schedule.maxParticipants}
                      sx={{
                        background: schedule.registrationStatus === '신청완료' 
                          ? 'linear-gradient(45deg, #4caf50, #66bb6a)'
                          : 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        '&:hover': {
                          background: schedule.registrationStatus === '신청완료'
                            ? 'linear-gradient(45deg, #388e3c, #4caf50)'
                            : 'linear-gradient(45deg, #1565c0, #1976d2)',
                        }
                      }}
                    >
                      {schedule.registrationStatus === '신청완료' ? '신청완료' : '신청하기'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 신청 안내 */}
      <Box sx={{ mt: 6 }}>
        <Card sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              교육 신청 안내
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              모든 교육은 사전 신청제로 운영됩니다. 
              온라인과 오프라인 수업을 선택할 수 있으며, 하이브리드 수업의 경우 두 방식 모두 가능합니다.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
              <Chip icon={<VideoCall />} label="온라인 수업" color="secondary" />
              <Chip icon={<LocationOn />} label="오프라인 수업" color="success" />
              <Chip icon={<SwapHoriz />} label="하이브리드 수업" color="warning" />
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* 신청 다이얼로그 */}
      <Dialog open={openDialog} onClose={handleRegistrationClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          교육 신청
          {selectedSchedule && (
            <Typography variant="subtitle1" color="text.secondary">
              {selectedSchedule.title}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedSchedule && (
            <Box sx={{ pt: 2 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                선택하신 교육은 <strong>{selectedSchedule.classType}</strong> 형태로 진행됩니다.
                {selectedSchedule.classType === '하이브리드' && ' 온라인과 오프라인 중 선택 가능합니다.'}
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    교육 정보
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    일시: {new Date(selectedSchedule.date).toLocaleDateString('ko-KR')} {selectedSchedule.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    강사: {selectedSchedule.instructor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    수강료: ₩ {selectedSchedule.price.toLocaleString()}
                  </Typography>
                </Grid>
                
                {selectedSchedule.classType === '하이브리드' && (
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel>수강 방식</InputLabel>
                      <Select
                        value={registrationInfo.classFormat}
                        label="수강 방식"
                        onChange={(e) => setRegistrationInfo(prev => ({
                          ...prev,
                          classFormat: e.target.value as '온라인' | '오프라인'
                        }))}
                      >
                        <MenuItem value="온라인">온라인 수업</MenuItem>
                        <MenuItem value="오프라인">오프라인 수업</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegistrationClose}>취소</Button>
          <Button 
            onClick={handleRegistrationSubmit} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)',
              }
            }}
          >
            신청하기
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 