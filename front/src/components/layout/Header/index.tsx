'use client';

import { useState } from 'react';
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

// 메뉴 데이터
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
{ name: '교육 일정', link: '/inquiry/schedule' },
{ name: '교육 소식보기', link: '/inquiry/news' }
]
},
{
title: '교육 제품 (Kit)',
items: [
{ name: '메이커 / AI제품', link: '/products/maker-ai' },
{ name: 'AI교육 프로그램', link: '/products/ai-education' },
{ name: '수업자료 다운로드', link: '/products/downloads' },
{ name: '자주묻는질문(FAQ)', link: '/products/faq' }
]
},
{
title: 'AI Maker 소개',
items: [
{ name: 'AI Maker 소개', link: '/about/introduction' },
{ name: '문의 및 오시는길', link: '/about/contact' }
]
}
];

// 메인 컴포넌트
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

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const { name, value } = e.target;
setLoginData(prev => ({
...prev,
[name]: value
}));
};

const handleLogin = async () => {
try {
const response = await axios.post('http://localhost:8000/api/v1/auth/login/', {
email: loginData.email,
password: loginData.password
});

if (response.status === 200 && response.data) {
localStorage.setItem("token", response.data.tokens.access);
localStorage.setItem("refresh_token", response.data.tokens.refresh);
localStorage.setItem("user", response.data.user.name);
setUserName(response.data.user.name);
handleLoginClose();
}
} catch (err) {
setError('로그인에 실패했습니다.');
console.error('로그인 에러:', err);
}
};

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

const handleLoginClick = () => {
setOpenLoginDialog(true);
};

const handleRegisterClick = () => {
setOpenLoginDialog(false);
setOpenRegisterDialog(true);
};

const handleLoginClose = () => {
setOpenLoginDialog(false);
setLoginData({ email: '', password: '' });
setError('');
};

const handleRegisterClose = () => {
setOpenRegisterDialog(false);
setRegisterError('');
};

const handleMenuClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
event.preventDefault();
const newAnchorEls = [...anchorEls];
newAnchorEls[index] = event.currentTarget;
setAnchorEls(newAnchorEls);
setOpenMenuIndex(openMenuIndex === index ? null : index);
};

const handleMenuEnter = (event: React.MouseEvent<HTMLElement>, index: number) => {
if (openMenuIndex !== null) {
const newAnchorEls = [...anchorEls];
newAnchorEls[index] = event.currentTarget;
setAnchorEls(newAnchorEls);
setOpenMenuIndex(index);
}
};

const handleClose = () => {
setOpenMenuIndex(null);
setAnchorEls(new Array(menuItems.length).fill(null));
};

return (
<>
<AppBar position="sticky" color="default" elevation={1} sx={{ position: 'relative', zIndex: 1000 }}> <Container maxWidth="lg">
<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}> <Logo />


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
              pt: 1 ,                                      
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
