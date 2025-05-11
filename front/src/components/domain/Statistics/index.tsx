'use client';

import { Box, Container, Typography, Grid } from '@mui/material';
import { School, AccessTime, Group, Book, Business, Assignment } from '@mui/icons-material';
import Image from 'next/image';

const StatItem = ({ value, label, icon: Icon }: { value: string; label: string; icon: any }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: 'primary.main',
        color: 'white',
        mr: 2,
      }}
    >
      <Icon />
    </Box>
    <Box>
      <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
    </Box>
  </Box>
);

export default function Statistics() {
  return (
    <Box sx={{ py: 6, backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* 왼쪽 통계 섹션 */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              AI Maker Lab의 찾아가는 코딩 수업!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              코딩교육의 필요한 공간에, 여기저기 달려갑니다.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Typography component="span" sx={{ color: 'primary.main', mr: 1 }}>✓</Typography>
                <Typography>초등학교</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Typography component="span" sx={{ color: 'primary.main', mr: 1 }}>✓</Typography>
                <Typography>중학교</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Typography component="span" sx={{ color: 'primary.main', mr: 1 }}>✓</Typography>
                <Typography>고등학교</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography component="span" sx={{ color: 'primary.main', mr: 1 }}>✓</Typography>
                <Typography>대학교</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 4 }}>
              <StatItem value="2,959개교" label="AIMaker Lab 수업한 학교 수" icon={School} />
              <StatItem value="23,761시간" label="선생님이 진행한 수업시간" icon={AccessTime} />
              <StatItem value="33,667명" label="수업을 참여한 학생 수" icon={Group} />
              <StatItem value="95,090개" label="교육키트 누적 판매수" icon={Book} />
              <StatItem value="32개" label="협계약 대학 및 기관" icon={Business} />
              <StatItem value="25,787개" label="교육 및 수업 영상 누적 시청시간" icon={Assignment} />
            </Box>
          </Grid>

          {/* 오른쪽 이미지 섹션 */}
          <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
            <Box
              sx={{
                position: 'relative',
                height: '100%',
                minHeight: 400,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Image
                src="/images/coding-education.jpg"
                alt="온라인 스마트 시대 열기"
                fill
                style={{ objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  온라인 스마트 시대 열기
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  · 대상 : 전 연령대 맞춤형 코딩 교육
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  #원격교육 #AIMakerLab #메타버스교육 #4차산업혁명
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 