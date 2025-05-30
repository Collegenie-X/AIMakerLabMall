'use client';

import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Divider,
  Button,
  Chip
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
  DirectionsBus,
  DirectionsSubway,
  LocalParking,
  Business
} from '@mui/icons-material';

/**
 * 연락처 정보 타입 정의
 */
interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  content: string[];
  color: string;
}

/**
 * 교통 정보 타입 정의
 */
interface TransportInfo {
  type: string;
  icon: React.ReactNode;
  routes: string[];
  color: string;
}

/**
 * 문의 및 오시는길 페이지 컴포넌트
 * 연락처 정보와 찾아오는 방법을 제공하는 페이지
 */
export default function AboutContactPage() {
  /**
   * 연락처 정보 데이터
   */
  const contactInfos: ContactInfo[] = [
    {
      icon: <Phone sx={{ fontSize: 32 }} />,
      title: '전화 문의',
      content: ['02-1234-5678', '평일 09:00 - 18:00'],
      color: '#4caf50'
    },
    {
      icon: <Email sx={{ fontSize: 32 }} />,
      title: '이메일',
      content: ['info@aimakerlab.com', '24시간 접수 가능'],
      color: '#2196f3'
    },
    {
      icon: <LocationOn sx={{ fontSize: 32 }} />,
      title: '주소',
      content: ['서울시 강남구 테헤란로 123', '(우) 06234'],
      color: '#ff9800'
    },
    {
      icon: <Schedule sx={{ fontSize: 32 }} />,
      title: '운영 시간',
      content: ['평일: 09:00 - 18:00', '토요일: 10:00 - 16:00', '일요일 및 공휴일 휴무'],
      color: '#9c27b0'
    }
  ];

  /**
   * 교통 정보 데이터
   */
  const transportInfos: TransportInfo[] = [
    {
      type: '지하철',
      icon: <DirectionsSubway sx={{ fontSize: 24 }} />,
      routes: ['2호선 강남역 3번 출구 도보 5분', '9호선 신논현역 1번 출구 도보 7분'],
      color: '#4caf50'
    },
    {
      type: '버스',
      icon: <DirectionsBus sx={{ fontSize: 24 }} />,
      routes: ['간선: 146, 360, 740', '지선: 3412, 6411', '광역: 9303, 9408'],
      color: '#2196f3'
    },
    {
      type: '주차',
      icon: <LocalParking sx={{ fontSize: 24 }} />,
      routes: ['건물 지하 1-3층 주차 가능', '2시간 무료 주차 제공', '발렛파킹 서비스 이용 가능'],
      color: '#ff9800'
    }
  ];

  /**
   * 부서별 연락처 데이터
   */
  const departmentContacts = [
    {
      department: '교육 문의',
      contact: '02-1234-5678',
      email: 'education@aimakerlab.com',
      description: '교육 과정, 수강 신청, 일정 문의'
    },
    {
      department: '기업 교육',
      contact: '02-1234-5679',
      email: 'corporate@aimakerlab.com',
      description: '기업 맞춤 교육, 단체 교육 문의'
    },
    {
      department: '제품 문의',
      contact: '02-1234-5680',
      email: 'products@aimakerlab.com',
      description: '교육 키트, 제품 구매 문의'
    },
    {
      department: '일반 문의',
      contact: '02-1234-5681',
      email: 'info@aimakerlab.com',
      description: '기타 문의사항, 제휴 문의'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          문의 및 오시는길
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          AI MAKER LAB을 찾아주시는 모든 분들을 환영합니다.
          언제든지 편리하게 연락주세요.
        </Typography>
      </Box>

      {/* 연락처 정보 */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {contactInfos.map((info, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ color: info.color, mb: 2 }}>
                  {info.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {info.title}
                </Typography>
                {info.content.map((item, idx) => (
                  <Typography 
                    key={idx} 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {item}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* 지도 및 위치 정보 */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 0 }}>
              {/* 지도 영역 (실제 구현시 Google Maps나 Kakao Map API 사용) */}
              <Box 
                sx={{ 
                  height: 400,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <LocationOn sx={{ fontSize: 80, mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    AI MAKER LAB
                  </Typography>
                  <Typography variant="body1">
                    서울시 강남구 테헤란로 123
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ 
                      mt: 2,
                      bgcolor: 'white',
                      color: '#1976d2',
                      '&:hover': {
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  >
                    지도에서 보기
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* 교통 정보 */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                교통 안내
              </Typography>
              <Grid container spacing={3}>
                {transportInfos.map((transport, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper sx={{ p: 3, border: `2px solid ${transport.color}20` }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ color: transport.color, mr: 2 }}>
                          {transport.icon}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {transport.type}
                        </Typography>
                      </Box>
                      <Stack spacing={1}>
                        {transport.routes.map((route, idx) => (
                          <Typography key={idx} variant="body2" color="text.secondary">
                            • {route}
                          </Typography>
                        ))}
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 부서별 연락처 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                부서별 연락처
              </Typography>
              <Stack spacing={3}>
                {departmentContacts.map((dept, index) => (
                  <Box key={index}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {dept.department}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {dept.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ fontSize: 16, mr: 1, color: '#4caf50' }} />
                      <Typography variant="body2">{dept.contact}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ fontSize: 16, mr: 1, color: '#2196f3' }} />
                      <Typography variant="body2">{dept.email}</Typography>
                    </Box>
                    {index < departmentContacts.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* 빠른 문의 */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Business sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                빠른 문의
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                궁금한 점이 있으시면 언제든지 연락주세요.
                전문 상담원이 친절하게 안내해 드립니다.
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Phone />}
                  sx={{
                    background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                    }
                  }}
                >
                  전화 문의
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Email />}
                >
                  이메일 문의
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 방문 안내 */}
      <Paper sx={{ p: 4, mt: 6, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          방문 안내
        </Typography>
        <Grid container spacing={4} sx={{ textAlign: 'center' }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              사전 예약
            </Typography>
            <Typography variant="body2" color="text.secondary">
              원활한 상담을 위해 방문 전 사전 예약을 권장합니다.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              주차 안내
            </Typography>
            <Typography variant="body2" color="text.secondary">
              건물 지하 주차장 이용 가능하며, 2시간 무료 주차를 제공합니다.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              시설 견학
            </Typography>
            <Typography variant="body2" color="text.secondary">
              교육 시설 견학을 원하시면 미리 연락주시기 바랍니다.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
} 