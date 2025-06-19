import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// 컴포넌트 임포트
import Header from './components/shared/Header';
import HomePage from './pages/HomePage';
import SchedulePage from './components/schedule/SchedulePage';
import OutreachInquiriesPage from './components/inquiries/OutreachInquiriesPage';
import InquiryDetailPage from './components/inquiries/InquiryDetailPage';
import InquiryCreatePage from './components/inquiries/InquiryCreatePage';
import LoginPage from './components/auth/LoginPage';

/**
 * Material-UI 테마 생성
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      'Pretendard',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

/**
 * 메인 App 컴포넌트
 */
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              {/* 홈페이지 */}
              <Route path="/" element={<HomePage />} />
              
              {/* 로그인 */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* 교육 일정 */}
              <Route path="/schedule" element={<SchedulePage />} />
              
              {/* 문의 관련 */}
              <Route path="/inquiries" element={<OutreachInquiriesPage />} />
              <Route path="/inquiries/new" element={<InquiryCreatePage />} />
              <Route path="/inquiries/:id" element={<InquiryDetailPage />} />
              
              {/* 문의 작성 - 별칭 라우트 */}
              <Route path="/inquiry/contact" element={<InquiryCreatePage />} />
              
              {/* 추후 추가될 페이지들 */}
              <Route path="/news" element={<div style={{ padding: '2rem' }}>교육 소식 페이지 (준비중)</div>} />
              <Route path="/about" element={<div style={{ padding: '2rem' }}>AI MAKER 소개 페이지 (준비중)</div>} />
              <Route path="/contact" element={<div style={{ padding: '2rem' }}>문의 및 오시는길 페이지 (준비중)</div>} />
              
              {/* 404 페이지 */}
              <Route path="*" element={
                <div style={{ 
                  padding: '4rem', 
                  textAlign: 'center',
                  fontSize: '1.2rem',
                  color: '#666'
                }}>
                  페이지를 찾을 수 없습니다.
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App; 