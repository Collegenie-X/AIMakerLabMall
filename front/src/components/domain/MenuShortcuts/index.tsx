'use client';

import { Container, Typography, Box, Divider, styled, Stack } from '@mui/material';
import Link from 'next/link';
import { menuShortcuts } from '@/config/menuShortcuts';

const ShortcutsContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const ShortcutBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const IconBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& svg': {
    fontSize: 40,
    color: theme.palette.grey[500],
  }
}));

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  width: '100%',
  textAlign: 'center',
});

const ShortcutTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,  
  color: theme.palette.grey[600],
  textAlign: 'center',
  fontWeight: 600,
}));

export default function MenuShortcuts() {
  return (
    <ShortcutsContainer>
      <Container maxWidth="lg">
        <StyledLink href="/" >
          <Box sx={{ display: 'flex', alignItems: 'center' , mx:"auto" ,justifyContent:"center" }}>
            <Typography variant="h5" component="span" sx={{ color: '#E53E3E', fontWeight: 'bold' }}>
              AI Maker
            </Typography>
            <Typography variant="h5" component="span" sx={{ ml: 1 , fontWeight:"bold" }}>
              Lab 메뉴 바로가기
            </Typography>
          </Box>
        </StyledLink>
        
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          sx={{ mt: 5, mx: 10 }}
        >
          {menuShortcuts.map((shortcut) => {
            const IconComponent = shortcut.icon;
            
            return (
              <Box key={shortcut.id} sx={{ flex: 1, textAlign: 'center' }}>
                <StyledLink href={shortcut.url}>
                  <ShortcutBox>
                    <IconBox>
                      <IconComponent />
                    </IconBox>
                    <ShortcutTitle>
                      {shortcut.title}
                    </ShortcutTitle>
                  </ShortcutBox>
                </StyledLink>
              </Box>
            );
          })}
        </Stack>
        
        <Divider sx={{ mt: 2 }} />
      </Container>
    </ShortcutsContainer>
  );
} 