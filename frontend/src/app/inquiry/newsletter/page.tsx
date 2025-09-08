'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Chip,
  Avatar,
  Divider,
  Alert,
  Paper,
  Stack,
  IconButton
} from '@mui/material';
import {
  Email,
  Notifications,
  TrendingUp,
  Schedule,
  Group,
  Share,
  Bookmark,
  ArrowForward
} from '@mui/icons-material';

/**
 * 뉴스레터 구독 정보 타입
 */
interface NewsletterSubscription {
  email: string;
  interests: string[];
  frequency: 'weekly' | 'biweekly' | 'monthly';
}

/**
 * 교육 소식 아이템 타입
 */
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  image?: string;
}

/**
 * 교육 소식 받기 페이지 컴포넌트
 * 뉴스레터 구독 및 최신 교육 소식을 제공하는 페이지
 */
export default function NewsletterPage() {
  const [subscriptionData, setSubscriptionData] = useState<NewsletterSubscription>({
    email: '',
    interests: [],
    frequency: 'weekly'
  });
  const [subscribed, setSubscribed] = useState(false);

  /**
   * 관심 분야 목록
   */
  const interestOptions = ['앱 개발', 'AI/머신러닝', '아두이노', 'Raspberry Pi', '메이커 교육', '프로그래밍', 'IoT'];

  /**
   * 최신 교육 소식 데이터
   */
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: '2024년 새로운 AI 교육 커리큘럼 출시',
      summary: 'ChatGPT와 함께하는 창의적 AI 활용 교육 프로그램이 새롭게 시작됩니다. 중고등학생을 대상으로 한 실습 중심의 교육 과정입니다.',
      date: '2024-03-10',
      category: 'AI 교육',
      tags: ['AI', '신규 과정', '중고등학생'],
      readTime: '3분'
    },
    {
      id: '2',
      title: '메이커 페어 2024 참가 학생 모집',
      summary: 'AI Maker Lab 학생들이 제작한 창의적인 프로젝트를 전시할 메이커 페어 참가 학생을 모집합니다.',
      date: '2024-03-08',
      category: '행사 안내',
      tags: ['메이커 페어', '프로젝트', '전시'],
      readTime: '2분'
    },
    {
      id: '3',
      title: '아두이노 고급 과정 수강생 후기',
      summary: '실제 IoT 프로젝트를 완성한 학생들의 생생한 후기와 작품 소개를 만나보세요.',
      date: '2024-03-05',
      category: '수강 후기',
      tags: ['아두이노', '후기', 'IoT'],
      readTime: '5분'
    },
    {
      id: '4',
      title: '온라인 교육 플랫폼 업데이트',
      summary: '더욱 편리해진 온라인 학습 환경과 새로운 기능들을 소개합니다.',
      date: '2024-03-03',
      category: '플랫폼',
      tags: ['온라인', '업데이트', '학습환경'],
      readTime: '4분'
    }
  ];

  /**
   * 이메일 입력 핸들러
   */
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubscriptionData(prev => ({
      ...prev,
      email: event.target.value
    }));
  };

  /**
   * 관심 분야 선택 핸들러
   */
  const handleInterestToggle = (interest: string) => {
    setSubscriptionData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(item => item !== interest)
        : [...prev.interests, interest]
    }));
  };

  /**
   * 구독 빈도 변경 핸들러
   */
  const handleFrequencyChange = (frequency: 'weekly' | 'biweekly' | 'monthly') => {
    setSubscriptionData(prev => ({
      ...prev,
      frequency
    }));
  };

  /**
   * 뉴스레터 구독 핸들러
   */
  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('구독 정보:', subscriptionData);
    setSubscribed(true);
  };

  /**
   * 날짜 포맷팅 함수
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          교육 소식 받기
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          AI MAKER LAB의 최신 교육 소식과 새로운 프로그램 정보를 
          가장 먼저 받아보세요.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* 뉴스레터 구독 섹션 */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: 'fit-content', position: 'sticky', top: 20 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#1976d2', 
                    width: 64, 
                    height: 64, 
                    mx: 'auto', 
                    mb: 2 
                  }}
                >
                  <Email sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  뉴스레터 구독
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  맞춤형 교육 정보를 이메일로 받아보세요
                </Typography>
              </Box>

              {subscribed ? (
                <Alert severity="success" sx={{ mb: 3 }}>
                  뉴스레터 구독이 완료되었습니다! 
                  첫 번째 소식을 곧 받아보실 수 있습니다.
                </Alert>
              ) : null}

              <Box component="form" onSubmit={handleSubscribe}>
                {/* 이메일 입력 */}
                <TextField
                  fullWidth
                  label="이메일 주소"
                  type="email"
                  required
                  value={subscriptionData.email}
                  onChange={handleEmailChange}
                  sx={{ mb: 3 }}
                />

                {/* 관심 분야 선택 */}
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  관심 분야
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {interestOptions.map((interest) => (
                      <Chip
                        key={interest}
                        label={interest}
                        onClick={() => handleInterestToggle(interest)}
                        variant={subscriptionData.interests.includes(interest) ? 'filled' : 'outlined'}
                        color={subscriptionData.interests.includes(interest) ? 'primary' : 'default'}
                        sx={{ 
                          mb: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: subscriptionData.interests.includes(interest) 
                              ? 'primary.dark' 
                              : 'action.hover'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* 구독 빈도 */}
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  구독 빈도
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  {[
                    { value: 'weekly', label: '주간' },
                    { value: 'biweekly', label: '격주' },
                    { value: 'monthly', label: '월간' }
                  ].map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      onClick={() => handleFrequencyChange(option.value as any)}
                      variant={subscriptionData.frequency === option.value ? 'filled' : 'outlined'}
                      color={subscriptionData.frequency === option.value ? 'primary' : 'default'}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Stack>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<Notifications />}
                  sx={{
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                    }
                  }}
                >
                  구독 신청하기
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 최신 소식 섹션 */}
        <Grid item xs={12} md={7}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            최신 교육 소식
          </Typography>

          <Stack spacing={3}>
            {newsItems.map((news, index) => (
              <Card 
                key={news.id}
                sx={{ 
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* 뉴스 헤더 */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {news.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip label={news.category} size="small" color="primary" />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(news.date)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • {news.readTime} 읽기
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" color="primary">
                        <Bookmark />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Share />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* 뉴스 내용 */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {news.summary}
                  </Typography>

                  {/* 태그 */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                    {news.tags.map((tag) => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* 액션 버튼 */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      variant="text"
                      endIcon={<ArrowForward />}
                      sx={{ fontWeight: 'bold' }}
                    >
                      자세히 보기
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="caption" color="success.main">
                        인기 글
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {/* 더 보기 버튼 */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              sx={{ minWidth: 200 }}
            >
              더 많은 소식 보기
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* 통계 정보 */}
      <Box sx={{ mt: 6 }}>
        <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Grid container spacing={4} sx={{ color: 'white', textAlign: 'center' }}>
            <Grid item xs={12} sm={3}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                1,500+
              </Typography>
              <Typography variant="body1">
                구독자
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                200+
              </Typography>
              <Typography variant="body1">
                발행된 소식
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                95%
              </Typography>
              <Typography variant="body1">
                만족도
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                주 1회
              </Typography>
              <Typography variant="body1">
                정기 발송
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
} 