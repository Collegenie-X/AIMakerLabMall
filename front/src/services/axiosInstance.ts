// Axios 인스턴스 설정
// API 호출을 위한 공통 설정 및 인터셉터

import axios from 'axios';

// API 기본 URL 설정 (.env에서 이미 /api/v1이 포함됨)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * 로컬 스토리지에서 유효한 토큰을 안전하게 가져오는 함수
 * 브라우저 환경에서만 작동하며, 유효성 검사 포함
 */
const getValidToken = (): string | null => {
  // 서버 사이드 렌더링 환경에서는 null 반환
  if (typeof window === 'undefined') return null;
  
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // 토큰이 없거나 빈 문자열인 경우
    if (!token || token.trim() === '') {
      return null;
    }
    
    // 기본적인 JWT 형식 검증 (3개 부분으로 구성되어야 함)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.warn('잘못된 토큰 형식입니다.');
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('토큰 접근 중 오류 발생:', error);
    return null;
  }
};

/**
 * 토큰을 안전하게 제거하는 함수
 */
const clearTokens = (): void => {
  try {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  } catch (error) {
    console.error('토큰 제거 중 오류 발생:', error);
  }
};

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    // 유효한 토큰만 헤더에 추가
    const token = getValidToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 처리 (인증 실패)
    if (error.response && error.response.status === 401) {
      console.warn('인증 토큰이 만료되었거나 유효하지 않습니다.');
      
      // 토큰 제거
      clearTokens();
      
      // Products API가 아닌 경우에만 로그인 페이지로 리다이렉트
      const isProductsAPI = error.config?.url?.includes('/products');
      if (!isProductsAPI) {
        // 로그인 페이지로 리다이렉트 (필요시)
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 