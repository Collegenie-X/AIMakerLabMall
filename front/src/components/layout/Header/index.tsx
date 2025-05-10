'use client';

import { useState } from 'react';
import { AppBar, Box, Container, Typography, Button, Popper, Paper, ClickAwayListener } from '@mui/material';
import Link from 'next/link';

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

export default function Header() {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [anchorEls, setAnchorEls] = useState<(HTMLElement | null)[]>(new Array(menuItems.length).fill(null));

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
    <AppBar position="sticky" color="default" elevation={1} className="relative z-[1000]">
      <Container maxWidth="lg">
        <Box className="flex items-center justify-between py-2">
          <Link href="/" className="no-underline">
            <Box className="flex items-center">
              <Typography variant="h6" component="span" className="text-red-600 font-bold">
                AI Maker
              </Typography>
              <Typography variant="h6" component="span" className="ml-1">
                Lab
              </Typography>
            </Box>
          </Link>

          <Box className="flex space-x-10">
            {menuItems.map((menu, index) => (
              <Box 
                key={index} 
                onMouseEnter={(e) => handleMenuEnter(e, index)}
                className="relative"
              >
                <Button 
                  color="inherit"
                  onClick={(e) => handleMenuClick(e, index)}
                  className="z-10"
                >
                  {menu.title}
                </Button>
                <Popper
                  open={openMenuIndex === index}
                  anchorEl={anchorEls[index]}
                  placement="bottom-start"
                  className="z-[1001]"
                  style={{ minWidth: '140px' }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <Paper 
                      elevation={3}
                      className="mt-2"
                      sx={{
                        borderRadius: '5px', 
                      }}
                    >
                      {menu.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={item.link}
                          className="no-underline text-inherit block"
                        >
                          <Box
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                            sx={{                              
                              fontSize: '13px', 
                              '&:hover': {
                                backgroundColor: '#1891E0',
                                color: '#fff'                                
                              }
                            }}
                          >
                            {item.name}
                          </Box>
                        </Link>
                      ))}
                    </Paper>
                  </ClickAwayListener>
                </Popper>
              </Box>
            ))}
            <Button color="inherit" sx={{ ml: 10  }}>로그인</Button>
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
} 