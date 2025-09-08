// 인증 관련 커스텀 훅
// 로그인, 회원가입, 로그아웃 등 인증 관련 비즈니스 로직

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useLoginMutation, useSignupMutation, useLogoutMutation } from '../queries/authQueries';

interface SignupData {
  email: string;
  password: string;
  name: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  const logoutMutation = useLogoutMutation();
  
  // 로그인 함수
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await loginMutation.mutateAsync({ email, password });
      
      // Store tokens and user data
      localStorage.setItem('token', response.tokens.access);
      localStorage.setItem('refresh_token', response.tokens.refresh);
      localStorage.setItem('user', response.user.name);
      
      router.push('/');
    } catch (err) {
      setError('로그인에 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // 회원가입 함수
  const signup = async (userData: SignupData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await signupMutation.mutateAsync(userData);
      
      // Store tokens and user data
      localStorage.setItem('token', response.tokens.access);
      localStorage.setItem('refresh_token', response.tokens.refresh);
      localStorage.setItem('user', response.user.name);
      
      router.push('/verify-email-sent');
    } catch (err) {
      setError('회원가입에 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // 로그아웃 함수
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await logoutMutation.mutateAsync();
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Clear query cache
      queryClient.clear();
      
      router.push('/');
    } catch (err) {
      setError('로그아웃에 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // 인증 상태 확인 함수
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };
  
  return {
    isLoading,
    error,
    login,
    signup,
    logout,
    checkAuth
  };
} 