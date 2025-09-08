// 테마 설정
// 색상, 폰트, 간격 등 디자인 시스템 정의

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter)',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
  },
}); 