// 인증 관련 React Query 훅
// 로그인, 회원가입, 로그아웃 등의 쿼리 및 뮤테이션

import { useMutation, useQuery } from '@tanstack/react-query';
import authService from '../services/authService';

interface SignupData {
  email: string;
  password: string;
  name: string;
}

// 로그인 뮤테이션
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => 
      authService.login(credentials.email, credentials.password),
    onSuccess: (data) => {
      // 로그인 성공 시 로컬 스토리지에 토큰 저장
      localStorage.setItem('token', data.token);
    }
  });
};

// 회원가입 뮤테이션
export const useSignupMutation = () => {
  return useMutation({
    mutationFn: (userData: SignupData) => authService.signup(userData),
  });
};

// 로그아웃 뮤테이션
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // 로그아웃 성공 시 로컬 스토리지에서 토큰 제거
      localStorage.removeItem('token');
    }
  });
};

// 현재 사용자 정보 조회 쿼리
export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!localStorage.getItem('token'), // 토큰이 있을 때만 쿼리 실행
  });
}; 