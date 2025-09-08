/**
 * 인증 관련 서비스 모듈
 * JWT 토큰 관리, 로그인 상태 확인, 사용자 프로필 조회 등의 기능을 제공합니다.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * 사용자 정보 타입
 */
export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  is_active: boolean;
  date_joined: string;
}

/**
 * 로그인 응답 타입
 */
export interface LoginResponse {
  tokens: {
    access: string;
    refresh: string;
  };
  user: User;
}

/**
 * 사용자 프로필 응답 타입
 */
export interface UserProfileResponse {
  status: string;
  user: User;
}

/**
 * 회원가입 요청 타입
 */
export interface SignupRequest {
  email: string;
  password: string;
  username?: string;
}

/**
 * 토큰 저장소 관리 클래스
 */
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  /**
   * 액세스 토큰 저장
   */
  static setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
  }

  /**
   * 리프레시 토큰 저장
   */
  static setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  /**
   * 액세스 토큰 조회
   */
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  /**
   * 리프레시 토큰 조회
   */
  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  /**
   * 모든 토큰 제거
   */
  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }
}

/**
 * 인증 헤더 생성 함수
 */
const getAuthHeaders = (): HeadersInit => {
  const token = TokenManager.getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * 사용자 프로필 조회 함수
 * 현재 로그인한 사용자의 정보를 백엔드에서 가져옵니다.
 */
export const getUserProfile = async (): Promise<User> => {
  const token = TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/profile/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      // 토큰이 만료되었거나 유효하지 않음
      TokenManager.clearTokens();
      throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');
    }
    throw new Error('사용자 정보를 가져오는데 실패했습니다.');
  }

  const data: UserProfileResponse = await response.json();
  return data.user;
};

/**
 * 로그인 상태 확인 함수
 * 토큰이 있고 유효한지 확인합니다.
 */
export const checkAuthStatus = async (): Promise<{ isAuthenticated: boolean; user: User | null }> => {
  try {
    const token = TokenManager.getAccessToken();
    
    if (!token) {
      return { isAuthenticated: false, user: null };
    }

    // 백엔드에서 토큰 검증 및 사용자 정보 조회
    const user = await getUserProfile();
    return { isAuthenticated: true, user };
    
  } catch (error) {
    console.error('인증 상태 확인 중 오류:', error);
    TokenManager.clearTokens();
    return { isAuthenticated: false, user: null };
  }
};

/**
 * 로그아웃 함수
 * 토큰을 제거하고 로그아웃 처리합니다.
 */
export const logout = async (): Promise<void> => {
  try {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (refreshToken) {
      // 백엔드에 로그아웃 요청
      await fetch(`${API_BASE_URL}/api/v1/auth/logout/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ token: refreshToken }),
      });
    }
  } catch (error) {
    console.error('로그아웃 요청 중 오류:', error);
  } finally {
    // 로컬 토큰 제거
    TokenManager.clearTokens();
  }
};

/**
 * 로그인 함수
 * 이메일과 비밀번호로 로그인합니다.
 */
export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '로그인에 실패했습니다.');
  }

  const data: LoginResponse = await response.json();
  
  // 토큰 저장
  TokenManager.setAccessToken(data.tokens.access);
  TokenManager.setRefreshToken(data.tokens.refresh);
  
  return data.user;
};

/**
 * 토큰 새로고침 함수
 * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.
 */
export const refreshToken = async (): Promise<string> => {
  const refreshToken = TokenManager.getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다.');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    TokenManager.clearTokens();
    throw new Error('토큰 새로고침에 실패했습니다.');
  }

  const data = await response.json();
  TokenManager.setAccessToken(data.access);
  
  return data.access;
};

/**
 * 인증이 필요한 API 요청을 위한 헬퍼 함수
 */
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  // 401 에러 시 토큰 새로고침 시도
  if (response.status === 401) {
    try {
      await refreshToken();
      
      // 새로운 토큰으로 재요청
      return await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });
    } catch (error) {
      TokenManager.clearTokens();
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
  }

  return response;
};

// 회원가입 API
const signup = async (userData: SignupRequest): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '회원가입에 실패했습니다.');
  }

  const data: LoginResponse = await response.json();
  
  // 토큰 저장
  TokenManager.setAccessToken(data.tokens.access);
  TokenManager.setRefreshToken(data.tokens.refresh);
  
  return data.user;
};

// 비밀번호 재설정 요청 API
const requestPasswordReset = async (email: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
};

// 비밀번호 재설정 API
const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/api/v1/auth/reset-password/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword }),
  });
};

// Google 로그인 처리
export const handleGoogleLogin = async (idToken: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_token: idToken }),
    });

    if (!response.ok) {
      throw new Error('Google 로그인에 실패했습니다.');
    }

    const data = await response.json();
    
    // 토큰 저장
    if (data.tokens) {
      TokenManager.setAccessToken(data.tokens.access);
      TokenManager.setRefreshToken(data.tokens.refresh);
    }
    
    return data;
  } catch (error) {
    console.error('Google 로그인 오류:', error);
    throw error;
  }
};

// 테스트용 토큰 설정
export const setTestToken = (token: string) => {
  TokenManager.setAccessToken(token);
};

const authService = {
  getUserProfile,
  checkAuthStatus,
  logout,
  login,
  refreshToken,
  authenticatedFetch,
  signup,
  requestPasswordReset,
  resetPassword,
  handleGoogleLogin,
  setTestToken
};

export default authService;