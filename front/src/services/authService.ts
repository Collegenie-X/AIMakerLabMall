// 인증 관련 API 호출 서비스
// 로그인, 회원가입, 로그아웃 등의 API 함수 구현

import axios from 'axios';
import { LoginResponse, SignupRequest, User } from '../types/auth';

// API 기본 URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 인증 응답 타입 정의
export interface AuthResponse {
  tokens: {
    access: string;
    refresh: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
  };
}

/**
 * 로그인 함수
 * 
 * 사용자 인증을 처리하고 토큰을 저장합니다.
 * 
 * @param email 사용자 이메일
 * @param password 사용자 비밀번호
 * @returns 인증 응답 객체
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/login/`, {
      email,
      password
    });
    
    const { tokens, user } = response.data;
    
    // 토큰 저장
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    
    // 사용자 정보 저장
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    console.error('로그인 오류:', error);
    throw error;
  }
};

// 회원가입 API
const signup = async (userData: SignupRequest): Promise<User> => {
  const response = await axios.post<User>(`${API_URL}/api/v1/auth/signup/`, userData);
  return response.data;
};

/**
 * 로그아웃 함수
 * 
 * 저장된 인증 정보를 제거합니다.
 */
export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * 현재 로그인 상태를 확인하는 함수
 * 
 * @returns 로그인 여부
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return !!localStorage.getItem('accessToken');
};

/**
 * 현재 사용자 정보를 가져오는 함수
 * 
 * @returns 사용자 정보 객체 또는 null
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('사용자 정보 파싱 오류:', error);
    return null;
  }
};

// 비밀번호 재설정 요청 API
const requestPasswordReset = async (email: string): Promise<void> => {
  await axios.post(`${API_URL}/api/v1/auth/forgot-password/`, { email });
};

// 비밀번호 재설정 API
const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await axios.post(`${API_URL}/api/v1/auth/reset-password/`, { token, newPassword });
};

// Google 로그인 처리
export const handleGoogleLogin = async (idToken: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/google/login/`, {
      id_token: idToken
    });
    return response;
  } catch (error) {
    console.error('Error during Google login:', error);
    throw error;
  }
};

/**
 * 로그인 시 테스트용 토큰 설정 함수
 * 
 * 테스트 환경에서 사용할 수 있는 임시 토큰을 설정합니다.
 */
export const setTestToken = (): void => {
  // 테스트용 임시 토큰 (실제 환경에서는 사용하지 않음)
  const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RAdGVzdC5jb20iLCJleHAiOjE3NDE3NTc5MTl9.DNKrO5g2xrMcn8KSJ1KL2r7KBfVd0anGVSGEoJ_a5Fo';
  
  localStorage.setItem('accessToken', testToken);
  
  // 테스트용 사용자 정보
  const testUser = {
    id: 1,
    username: 'testuser',
    email: 'test@test.com',
    is_staff: false
  };
  
  localStorage.setItem('user', JSON.stringify(testUser));
};

const authService = {
  login,
  signup,
  logout,
  getCurrentUser,
  requestPasswordReset,
  resetPassword
};

export default authService;