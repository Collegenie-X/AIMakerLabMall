/**
 * API 설정
 */
export const API_CONFIG = {
  BASE_URL: (window as any).REACT_APP_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    OUTREACH_INQUIRIES: '/outreach-inquiries',
    INTERNAL_CLASSES: '/internal-classes'
  }
};

// 환경 변수를 안전하게 가져오는 함수
const getApiUrl = () => {
  // 런타임에서 환경 변수 확인
  if (typeof window !== 'undefined') {
    // 브라우저 환경
    return 'http://localhost:8000';
  }
  return 'http://localhost:8000';
};

// API 설정 업데이트
API_CONFIG.BASE_URL = getApiUrl();

/**
 * API 헬퍼 함수들
 */
export const apiHelpers = {
  /**
   * 인증 헤더 생성
   */
  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  },

  /**
   * 완전한 URL 생성
   */
  getFullUrl: (endpoint: string) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  }
}; 