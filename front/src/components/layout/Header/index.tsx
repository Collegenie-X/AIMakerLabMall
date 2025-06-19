'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import {
  AppBar,
  Box,
  Container,
  Stack,
} from '@mui/material';

import Logo from './Logo';
import MenuItem from './MenuItem';
import LoginDialog from './LoginDialog';
import RegisterDialog from './RegisterDialog';
import UserMenu from './UserMenu';
import { useUser } from '@/contexts/UserContext';

/**
 * 메뉴 데이터 정의
 * 첨부파일 이미지에 맞게 메뉴 구조를 설정
 */
const menuItems = [
  {
    title: '교육 커리큘럼',
    items: [
      { name: '앱 인벤터 코딩', link: '/curriculum/app-inventor' },
      { name: '아두이노 코딩', link: '/curriculum/arduino' },
      { name: 'Raspberry pi코딩', link: '/curriculum/raspberry-pi' },
      { name: 'AI 코딩', link: '/curriculum/ai' },
      { name: '메이커교육', link: '/curriculum/maker' }
    ]
  },
  {
    title: '수업 문의',
    items: [
      { name: '수업 문의', link: '/inquiry/contact' },
      { name: '교육 일정', link: '/inquiry/schedule' },
      { name: '교육 소식 받기', link: '/inquiry/newsletter' }
    ]
  },
  {
    title: '교육 제품(KIT)',
    items: [
      { name: '메이커 / AI제품', link: '/products/maker-ai' },
      { name: 'AI교육 프로그램', link: '/products/ai-education' },
      { name: '수업자료 다운로드', link: '/products/downloads' },
      { name: '교육키트구매질문', link: '/inquiries' },
      { name: '자주묻는질문(FAQ)', link: '/products/faq' },
      
    ]
  },
  {
    title: 'AI MAKER 소개',
    items: [
      { name: 'AI MAKER 소개', link: '/about/introduction' },
      { name: '문의 및 오시는길', link: '/about/contact' }
    ]
  }
];

/**
 * 헤더 컴포넌트
 * 상단 네비게이션과 로그인/로그아웃 기능을 제공
 * 개선된 메뉴 닫기 기능 포함
 */
export default function Header() {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [anchorEls, setAnchorEls] = useState<(HTMLElement | null)[]>(new Array(menuItems.length).fill(null));
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const { userName, setUserName } = useUser();

  /**
   * ESC 키로 메뉴 닫기 기능
   */
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && openMenuIndex !== null) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [openMenuIndex]);

  /**
   * 로그인 입력 필드 변경 핸들러
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        
        // 사용자 정보 저장 - API 응답 구조에 맞게 수정
        const userName = response.data.user.name || response.data.user.username || response.data.user.email;
        localStorage.setItem("user", userName);
        setUserName(userName);
        
        console.log('로그인 성공, 사용자:', userName);
        handleLoginClose();
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
      
      setError(errorMessage);
    }
  };

  /**
   * 로그아웃 처리 함수
   */
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('refresh_token');
      await axios.post(
        'http://localhost:8000/api/v1/auth/logout/',
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUserName(null);
    }
  };

  /**
   * 로그인 다이얼로그 열기
   */
  const handleLoginClick = () => {
    handleClose(); // 메뉴가 열려있다면 먼저 닫기
    setOpenLoginDialog(true);
  };

  /**
   * 회원가입 다이얼로그 열기
   */
  const handleRegisterClick = () => {
    setOpenLoginDialog(false);
    setOpenRegisterDialog(true);
  };

  /**
   * 로그인 다이얼로그 닫기
   */
  const handleLoginClose = () => {
    setOpenLoginDialog(false);
    setLoginData({ email: '', password: '' });
    setError('');
  };

  /**
   * 회원가입 다이얼로그 닫기
   */
  const handleRegisterClose = () => {
    setOpenRegisterDialog(false);
    setRegisterError('');
  };

  /**
   * 메뉴 클릭 핸들러
   */
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    event.preventDefault();
    const newAnchorEls = [...anchorEls];
    newAnchorEls[index] = event.currentTarget;
    setAnchorEls(newAnchorEls);
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  /**
   * 메뉴 호버 핸들러
   */
  const handleMenuEnter = (event: React.MouseEvent<HTMLElement>, index: number) => {
    if (openMenuIndex !== null) {
      const newAnchorEls = [...anchorEls];
      newAnchorEls[index] = event.currentTarget;
      setAnchorEls(newAnchorEls);
      setOpenMenuIndex(index);
    }
  };

  /**
   * 메뉴 닫기 핸들러 - 개선된 버전
   * 모든 메뉴 상태를 완전히 초기화
   */
  const handleClose = () => {
    setOpenMenuIndex(null);
    setAnchorEls(new Array(menuItems.length).fill(null));
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={1} 
        sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
            <Logo />

            <Stack direction="row" spacing={10}>
              {menuItems.map((menu, index) => (
                <MenuItem 
                  key={index}
                  menu={menu}
                  index={index}
                  openMenuIndex={openMenuIndex}
                  anchorEl={anchorEls[index]}
                  handleMenuClick={handleMenuClick}
                  handleMenuEnter={handleMenuEnter}
                  handleClose={handleClose}
                />
              ))}
              {userName ? (
                <UserMenu userName={userName} onLogout={handleLogout} />
              ) : (
                <Box 
                  component="div" 
                  onClick={handleLoginClick} 
                  sx={{  
                    pt: 1,                                      
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    color: 'inherit',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                >
                  로그인
                </Box>
              )}
            </Stack>
          </Box>
        </Container>
      </AppBar>

      {/* 고정 헤더를 위한 스페이서 */}
      <Box sx={{ height: '80px' }} />

      <LoginDialog
        open={openLoginDialog}
        onClose={handleLoginClose}
        loginData={loginData}
        error={error}
        onInputChange={handleInputChange}
        onLogin={handleLogin}
        onRegisterClick={handleRegisterClick}
        setError={setError}
      />

      <RegisterDialog
        open={openRegisterDialog}
        onClose={handleRegisterClose}
        error={registerError}
      />
    </>
  );
} 
