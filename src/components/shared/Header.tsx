import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';

/**
 * 사용자 정보 인터페이스
 */
interface UserInfo {
  id: number;
  username: string;
  email: string;
  is_staff?: boolean;
}

/**
 * 헤더 컴포넌트
 */
const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /**
   * 사용자 정보 확인
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [location]); // location 변경 시마다 체크

  /**
   * 로그아웃 처리
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAnchorEl(null);
    navigate('/');
  };

  /**
   * 로그인 페이지로 이동
   */
  const handleLogin = () => {
    navigate('/login');
  };

  /**
   * 사용자 메뉴 열기/닫기
   */
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * 내 문의 페이지로 이동
   */
  const handleMyInquiries = () => {
    navigate('/inquiries?my=true');
    handleMenuClose();
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* 로고 */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            color: 'primary.main',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          AI Maker Lab
        </Typography>

        {/* 네비게이션 메뉴 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/schedule')}>
            교육 커리큘럼
          </Button>
          
          <Button color="inherit" onClick={() => navigate('/inquiries')}>
            수업 문의
          </Button>
          
          <Button color="inherit" onClick={() => navigate('/schedule')}>
            교육 일정
          </Button>
          
          <Button color="inherit" onClick={() => navigate('/news')}>
            교육 소식
          </Button>
          
          <Button color="inherit" onClick={() => navigate('/about')}>
            AI MAKER 소개
          </Button>
          
          <Button color="inherit" onClick={() => navigate('/contact')}>
            문의 및 오시는길
          </Button>

          {/* 로그인/사용자 메뉴 */}
          {user ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="subtitle2">{user.username}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                    {user.is_staff && (
                      <Typography variant="caption" color="primary" sx={{ display: 'block' }}>
                        관리자
                      </Typography>
                    )}
                  </Box>
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleMyInquiries}>
                  <PersonIcon sx={{ mr: 1 }} />
                  내 문의
                </MenuItem>
                
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  로그아웃
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="primary"
              variant="contained"
              startIcon={<AccountCircleIcon />}
              onClick={handleLogin}
            >
              로그인
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 