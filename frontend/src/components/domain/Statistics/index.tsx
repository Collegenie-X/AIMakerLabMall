'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { School, AccessTime, Group, Book, Business, Assignment, SvgIconComponent } from '@mui/icons-material';
import Image from 'next/image';
import { useState, useEffect } from 'react';

/**
 * 통계 아이템 컴포넌트
 * 
 * @param value - 통계 값 (숫자)
 * @param label - 통계 설명
 * @param icon - 표시할 아이콘 컴포넌트
 * @returns 통계 아이템 컴포넌트
 */
const StatItem = ({ value, label, icon: Icon }: { value: string; label: string; icon: SvgIconComponent }) => {
  // 간단한 애니메이션을 위한 상태
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center', 
        p: 1.5,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        '&:hover': {
          backgroundColor: 'rgba(25, 118, 210, 0.05)',
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          color: 'white',
          mb: 1.5,
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          boxShadow: isHovered ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
        }}
      >
        <Icon fontSize="medium" />
      </Box>
      <Typography 
        variant="h5" 
        component="div" 
        fontWeight="bold" 
        sx={{ 
          mb: 0.5,
          color: isHovered ? 'primary.main' : 'text.primary',
          transition: 'color 0.3s ease'
        }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
        {label}
      </Typography>
    </Box>
  );
};

/**
 * 통계 섹션 컴포넌트
 * 
 * 3x2 그리드 레이아웃으로 통계 정보를 표시하고 오른쪽에 이미지 배치
 * 
 * @returns 통계 섹션 컴포넌트
 */
export default function Statistics() {
  // 통계 데이터
  const statsData = [
    { value: "2,959개교", label: "AIMaker Lab 수업한 학교 수", icon: School },
    { value: "23,761시간", label: "선생님이 진행한 수업시간", icon: AccessTime },
    { value: "33,667명", label: "수업을 참여한 학생 수", icon: Group },
    { value: "95,090개", label: "교육키트 누적 판매수", icon: Book },
    { value: "32개", label: "협계약 대학 및 기관", icon: Business },
    { value: "25,787개", label: "교육 및 수업 영상 누적 시청시간", icon: Assignment }
  ];
  
  return (
    <Box sx={{ py: 6, backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* 왼쪽 통계 섹션 - 3x2 그리드 */}
          <Box sx={{ flex: '0 0 auto', width: { xs: '100%', md: '58%' } }}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              AI Maker Lab의 찾아가는 코딩 수업!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              코딩교육의 필요한 공간에, 여기저기 달려갑니다.
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
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
            
            {/* 3x2 통계 그리드 */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'background.default', 
                borderRadius: 2,
                boxShadow: '0 0 10px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                {/* 상단 3개 통계 */}
                {statsData.slice(0, 3).map((stat, index) => (
                  <StatItem key={index} value={stat.value} label={stat.label} icon={stat.icon} />
                ))}
                
                {/* 하단 3개 통계 */}
                {statsData.slice(3, 6).map((stat, index) => (
                  <StatItem key={index + 3} value={stat.value} label={stat.label} icon={stat.icon} />
                ))}
              </Box>
            </Paper>
          </Box>

          {/* 오른쪽 이미지 섹션 */}
          <Box sx={{ flex: '0 0 auto', width: { xs: '100%', md: '42%' }, position: 'relative' }}>
            <Box
              sx={{
                position: 'relative',
                height: '100%',
                minHeight: {
                  xs: 300,
                  sm: 400,
                  md: 450
                },
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.01)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                }
              }}
            >
              <Image
                src="/images/hero1.jpg"
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
                  maxWidth: '80%',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  }
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
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 