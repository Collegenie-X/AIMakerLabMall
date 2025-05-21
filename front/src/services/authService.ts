// 인증 관련 API 호출 서비스
// 로그인, 회원가입, 로그아웃 등의 API 함수 구현

import axiosInstance from './axiosInstance';
import { LoginResponse, SignupRequest, User } from '../types/auth';

// 로그인 API
const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', { email, password });
  return response.data;
};

// 회원가입 API
const signup = async (userData: SignupRequest): Promise<User> => {
  const response = await axiosInstance.post<User>('/auth/signup', userData);
  return response.data;
};

// 로그아웃 API
const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
  // 로컬 스토리지에서 토큰 제거는 쿼리에서 처리
};

// 현재 사용자 정보 조회 API
const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get<User>('/auth/me');
  return response.data;
};

// 비밀번호 재설정 요청 API
const requestPasswordReset = async (email: string): Promise<void> => {
  await axiosInstance.post('/auth/forgot-password', { email });
};

// 비밀번호 재설정 API
const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await axiosInstance.post('/auth/reset-password', { token, newPassword });
};

// Google 로그인 처리
export const handleGoogleLogin = async (idToken: string): Promise<any> => {
  try {
    const response = await axiosInstance.post('/auth/google/login/', {
      id_token: idToken
    });
    return response;
  } catch (error) {
    console.error('Error during Google login:', error);
    throw error;
  }
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