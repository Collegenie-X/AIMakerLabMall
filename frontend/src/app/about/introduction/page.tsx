'use client';

import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Paper,
  Stack,
  Chip,
  Button
} from '@mui/material';
import {
  School,
  Psychology,
  Groups,
  TrendingUp,
  EmojiObjects,
  Computer,
  Build,
  Science
} from '@mui/icons-material';

/**
 * 팀 멤버 타입 정의
 */
interface TeamMember {
  name: string;
  position: string;
  description: string;
  avatar: string;
  expertise: string[];
}

/**
 * AI MAKER 소개 페이지 컴포넌트
 * 회사 소개, 비전, 미션, 팀 소개 등을 제공하는 페이지
 */
export default function AboutIntroductionPage() {
  /**
   * 팀 멤버 데이터
   */
  const teamMembers: TeamMember[] = [
    {
      name: '김AI',
      position: '대표이사 / AI 교육 전문가',
      description: '10년 이상의 AI 연구 경험과 교육 노하우를 바탕으로 학생들에게 최고의 AI 교육을 제공합니다.',
      avatar: '/api/placeholder/150/150',
      expertise: ['AI/ML', '교육 설계', '프로젝트 관리']
    },
    {
      name: '박메이커',
      position: '교육 이사 / 메이커 교육 전문가',
      description: '다양한 메이커 프로젝트 경험을 통해 창의적이고 실용적인 교육 프로그램을 개발합니다.',
      avatar: '/api/placeholder/150/150',
      expertise: ['아두이노', '3D 프린팅', 'IoT']
    },
    {
      name: '이코딩',
      position: '기술 이사 / 프로그래밍 교육 전문가',
      description: '다양한 프로그래밍 언어와 플랫폼에 대한 깊은 이해로 체계적인 코딩 교육을 진행합니다.',
      avatar: '/api/placeholder/150/150',
      expertise: ['Python', 'JavaScript', '앱 개발']
    },
    {
      name: '최하드웨어',
      position: '연구 이사 / 하드웨어 전문가',
      description: '하드웨어와 소프트웨어의 융합을 통한 혁신적인 교육 솔루션을 연구 개발합니다.',
      avatar: '/api/placeholder/150/150',
      expertise: ['Raspberry Pi', '센서', '임베디드']
    }
  ];

  /**
   * 핵심 가치 데이터
   */
  const coreValues = [
    {
      icon: <EmojiObjects sx={{ fontSize: 40 }} />,
      title: '창의성',
      description: '학생들의 창의적 사고를 자극하고 혁신적인 아이디어를 실현할 수 있도록 지원합니다.'
    },
    {
      icon: <Computer sx={{ fontSize: 40 }} />,
      title: '기술 혁신',
      description: '최신 기술 트렌드를 교육에 접목하여 미래 지향적인 학습 경험을 제공합니다.'
    },
    {
      icon: <Groups sx={{ fontSize: 40 }} />,
      title: '협업',
      description: '팀워크와 소통을 통해 함께 성장하는 교육 환경을 조성합니다.'
    },
    {
      icon: <Build sx={{ fontSize: 40 }} />,
      title: '실용성',
      description: '이론과 실습의 균형을 통해 실제 활용 가능한 지식과 기술을 전달합니다.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          AI MAKER LAB 소개
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}>
          미래를 이끌어갈 창의적인 인재 양성을 위해 
          최고의 AI와 메이커 교육을 제공하는 교육 전문 기관입니다.
        </Typography>
      </Box>

      {/* 회사 소개 */}
      <Paper sx={{ p: 6, mb: 6, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ color: 'white' }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                우리의 미션
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.6 }}>
                "모든 학생이 AI와 기술을 통해 
                자신의 꿈을 실현할 수 있도록 돕는다"
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                AI MAKER LAB은 중고등학생들이 4차 산업혁명 시대에 필요한 
                핵심 역량을 기를 수 있도록 체계적이고 실용적인 교육을 제공합니다.
                단순한 지식 전달을 넘어서 창의적 사고와 문제 해결 능력을 
                기를 수 있는 프로젝트 중심의 교육을 진행합니다.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <Science sx={{ fontSize: 120, mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                혁신적인 교육 방법론
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 핵심 가치 */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 6 }}>
          핵심 가치
        </Typography>
        <Grid container spacing={4}>
          {coreValues.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ color: '#1976d2', mb: 2 }}>
                    {value.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 교육 성과 */}
      <Paper sx={{ p: 4, mb: 8, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          교육 성과
        </Typography>
        <Grid container spacing={4} sx={{ textAlign: 'center' }}>
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              500+
            </Typography>
            <Typography variant="h6">
              수료생
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              50+
            </Typography>
            <Typography variant="h6">
              프로젝트
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              98%
            </Typography>
            <Typography variant="h6">
              만족도
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              3년
            </Typography>
            <Typography variant="h6">
              운영 경력
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* 팀 소개 */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 6 }}>
          전문 교육진
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Avatar
                      sx={{ 
                        width: 80, 
                        height: 80,
                        bgcolor: '#1976d2',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {member.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {member.name}
                      </Typography>
                      <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {member.position}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        {member.description}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {member.expertise.map((skill) => (
                          <Chip 
                            key={skill} 
                            label={skill} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 비전 */}
      <Card sx={{ background: 'linear-gradient(45deg, #1976d2, #42a5f5)' }}>
        <CardContent sx={{ p: 6, textAlign: 'center', color: 'white' }}>
          <Psychology sx={{ fontSize: 80, mb: 3 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            우리의 비전
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}>
            "AI와 기술을 통해 더 나은 세상을 만들어가는 
            창의적이고 혁신적인 인재를 양성하는 
            대한민국 최고의 교육 기관이 되겠습니다."
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: '#1976d2',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: '#f5f5f5',
              }
            }}
          >
            교육 프로그램 보기
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
} 