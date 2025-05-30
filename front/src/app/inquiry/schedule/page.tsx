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
  Avatar,
  Stack
} from '@mui/material';
import {
  CalendarMonth,
  AccessTime,
  Group,
  School,
  ArrowForward,
  CheckCircle
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
  description: string;
}

/**
 * 교육 일정 페이지 컴포넌트
 * AI MAKER LAB의 교육 일정을 확인할 수 있는 페이지
 */
export default function EducationSchedulePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentMonth, setCurrentMonth] = useState<string>('2024-03');

  /**
   * 샘플 교육 일정 데이터
   */
  const scheduleData: EducationSchedule[] = [
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
      description: '스마트폰 앱 개발의 첫걸음, 블록 코딩으로 쉽게 배우는 앱 인벤터'
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
      description: '다양한 센서를 활용한 스마트 IoT 프로젝트 제작'
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
      description: 'Python을 활용한 머신러닝 기초와 실습 프로젝트'
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
      description: '라즈베리파이로 만드는 나만의 미니 컴퓨터'
    }
  ];

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
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* 카드 헤더 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {schedule.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {schedule.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={schedule.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(schedule.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Group sx={{ fontSize: 20, mr: 1, color: '#1976d2' }} />
                    <Typography variant="body2">
                      {schedule.participants}/{schedule.maxParticipants}명
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
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForward />}
                    sx={{
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                      }
                    }}
                  >
                    신청하기
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 빠른 안내 */}
      <Box sx={{ mt: 6 }}>
        <Card sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              교육 신청 안내
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              모든 교육은 사전 신청제로 운영됩니다. 
              원하시는 교육 프로그램의 '신청하기' 버튼을 클릭하여 참여 신청을 해주세요.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                }
              }}
            >
              전체 교육 프로그램 보기
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
} 