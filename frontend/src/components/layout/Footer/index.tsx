'use client';

import { Box, Container, Stack, Typography, styled, Divider } from '@mui/material';
import Link from 'next/link';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  marginTop: 'auto'
}));

const StyledList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  '& li': {
    marginBottom: '8px'
  }
});

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    color: '#1976d2'
  }
});

export default function Footer() {
  return (
    <StyledFooter>
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{ mb: 8 }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              AI Maker Lab | 만랩 회사 
            </Typography>
            <Divider sx={{mt: 2, mb: 1, mr:8 }} /> 
            <StyledList>
              <li>대표자: 김종필</li>
              <li>사업자등록번호: 760-57-00294</li>
              <li>통신판매업: 2020-경기하남-0094</li>
              <li>주소: 경기도 하남시 풍산동 미사강변서로 16</li>
              <li> 하우스디스마트벨리 F1046호</li>
              <br/>
              <li>대표메일: ceo.1000@gmail.com</li>
            </StyledList>
          </Box>

          <Box sx={{ flex: 1, px: 2  }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              고객 센터
            </Typography>
            <Divider sx={{mt: 2, mb: 1, mr:8 }} /> 
            <StyledList>
              {[
                '상담 시간: 평일 10:00 ~ 18:00 (점심시간 12:30~13:20)',
                '교육 문의: 010-2708-0051',
                '구매, 배송 문의: 010-2708-0051',
              ].map((text, index) => (
                <li key={index}>{text}</li>
              ))}
              <br/> 
              <li>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <span>고객 상담시간:</span>
                  <Box
                    component="img"
                    src="/images/kakao.png"
                    alt="카카오톡 상담"
                    sx={{ ml: 1, height: 24 }}
                  />
                </Box>
              </li>
              <li>※  주말 및 공휴일은 운영되지 않습니다. </li>
            </StyledList>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              메뉴
            </Typography>
            <Divider sx={{mt: 2, mb: 1, mr:8 }} /> 
            <StyledList>
              <li>
                <StyledLink href="/about/privacy">
                  회사 소개
                </StyledLink>
              </li>
              <li>
                <StyledLink href="/about/terms">
                  이용 약관
                </StyledLink>
              </li>
              <li>
                <StyledLink href="/about/company">
                  개인 정보취급 방침
                </StyledLink>
              </li>
              <li>
                <StyledLink href="/about/contact">
                  이메일 무단수집 거부
                </StyledLink>
              </li>
              <li>
                <StyledLink href="/about/contact">
                  네이버 스토어 팜 (AI Maker Lab) 
                </StyledLink>
              </li>


            </StyledList>
          </Box>
        </Stack>

        <Box sx={{ 
          pt: 4, 
          borderTop: 1, 
          borderColor: 'grey.300'
        }}>
          <Typography variant="body2" color="text.secondary" align="center">
            COPYRIGHT © 2019 BPLAB ALL RIGHTS RESERVED.
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
} 