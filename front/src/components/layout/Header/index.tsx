'use client';

import { useState } from 'react';
import axios from 'axios';
import {
AppBar,
Box,
Container,
Typography,
Button,
Popper,
Paper,
ClickAwayListener,
Stack,
styled,
Dialog,
DialogTitle,
DialogContent,
TextField,
DialogActions,
Divider
} from '@mui/material';
import Link from 'next/link';

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

// 스타일드 컴포넌트
const StyledLink = styled(Link)(({ theme }) => ({
textDecoration: 'none',
color: 'inherit',
}));

const MenuItemBox = styled(Box)(({ theme }) => ({
padding: theme.spacing(1, 2),
cursor: 'pointer',
fontSize: '13px',
'&:hover': {
backgroundColor: '#1891E0',
color: '#fff',
}
}));

// 서브 컴포넌트: 로고
const Logo = () => ( <StyledLink href="/">
<Box sx={{ display: 'flex', alignItems: 'center' }}>
<Typography variant="h6" component="span" sx={{ color: '#E53E3E', fontWeight: 'bold' }}>
AI Maker </Typography>
<Typography variant="h6" component="span" sx={{ ml: 1 }}>
Lab </Typography> </Box> </StyledLink>
);

// 서브 컴포넌트: 메뉴 아이템
interface MenuItemProps {
menu: {
title: string;
items: { name: string; link: string }[];
};
index: number;
openMenuIndex: number | null;
anchorEl: HTMLElement | null;
handleMenuClick: (event: React.MouseEvent<HTMLElement>, index: number) => void;
handleMenuEnter: (event: React.MouseEvent<HTMLElement>, index: number) => void;
handleClose: () => void;
}

const MenuItem = ({
menu,
index,
openMenuIndex,
anchorEl,
handleMenuClick,
handleMenuEnter,
handleClose
}: MenuItemProps) => (
<Box
onMouseEnter={(e) => handleMenuEnter(e, index)}
sx={{ position: 'relative' }}

>


<Button 



  color="inherit"
  sx={{ fontWeight: 'bold' }}
  onClick={(e) => handleMenuClick(e, index)}
>
  {menu.title}
</Button>
<Popper
  open={openMenuIndex === index}
  anchorEl={anchorEl}
  placement="bottom-start"
  sx={{ zIndex: 1001, minWidth: '140px' }}
>
  <ClickAwayListener onClickAway={handleClose}>
    <Paper 
      elevation={3}
      sx={{ 
        mt: 2,
        borderRadius: '5px',
      }}
    >
      {menu.items.map((item, itemIndex) => (
        <StyledLink
          key={itemIndex}
          href={item.link}
        >
          <MenuItemBox>
            {item.name}
          </MenuItemBox>
        </StyledLink>
      ))}
    </Paper>
  </ClickAwayListener>
</Popper>


  </Box>
);

// 메인 컴포넌트
export default function Header() {
const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
const [anchorEls, setAnchorEls] = useState<(HTMLElement | null)[]>(new Array(menuItems.length).fill(null));
const [openLoginDialog, setOpenLoginDialog] = useState(false);
const [loginData, setLoginData] = useState({
email: '',
password: ''
});
const [error, setError] = useState('');

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const { name, value } = e.target;
setLoginData(prev => ({
...prev,
[name]: value
}));
};

const handleLogin = async () => {
try {
const response = await axios.
            post('http://localhost:8000/api/v1/auth/login', {
email: loginData.email,
password: loginData.password
});


  if (response.status === 200 && response.data) {

    localStorage.setItem("token",response.data.tokens.access)
    console.log('로그인 성공:', response.data);
    handleLoginClose();
  }
} catch (err) {
  setError('로그인에 실패했습니다.');
  console.error('로그인 에러:', err);
}


};

const handleLoginClick = () => {
setOpenLoginDialog(true);
};

const handleLoginClose = () => {
setOpenLoginDialog(false);
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
        <Button color="inherit" sx={{ ml: 10, fontWeight: 'bold' }}  onClick={handleLoginClick}>로그인</Button>
      </Stack>
    </Box>
  </Container>
</AppBar>


<Dialog open={openLoginDialog} onClose={handleLoginClose}>
<DialogTitle sx={{ textAlign: 'center' }}>로그인</DialogTitle>
<DialogContent>
  <Stack spacing={2} sx={{ mt: 1, minWidth: '300px' }}>
    <TextField
      autoFocus
      label="이메일"
      type="email"
      name='email'
      value={loginData.email}
      onChange={handleInputChange}
      fullWidth
      variant="outlined"
    />
    <TextField
      label="비밀번호"
      type="password"
      name='password'
      value={loginData.password}
      onChange={handleInputChange}
      fullWidth
      variant="outlined"
    />


{error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
<Button 
  variant="contained" 
  fullWidth 
  sx={{ mt: 2 }}
  onClick={handleLogin}
>
  로그인
</Button>

<Divider sx={{ my: 2 }}>소셜 로그인</Divider>

<Button 
  variant="outlined" 
  fullWidth 
  sx={{ 
    mb: 1,
    bgcolor: '#fff',
    color: '#757575',
    borderColor: '#757575',
    '&:hover': {
      borderColor: '#616161',
      bgcolor: '#fafafa'
    }
  }}
>
  Google로 로그인
</Button>
<Button 
  variant="contained" 
  fullWidth
  sx={{ 
    bgcolor: '#FEE500',
    color: '#000',
    '&:hover': {
      bgcolor: '#FDD835'
    }
  }}
>
  카카오톡으로 로그인
</Button>


  </Stack>
</DialogContent>
<DialogActions sx={{ px: 3, pb: 2 }}>
  <Button onClick={handleLoginClose}>취소</Button>
</DialogActions>
</Dialog>
</>
  );
} 
