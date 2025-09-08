'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useUser } from '@/contexts/UserContext';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code&scope=profile_nickname,account_email`;

export default function KakaoCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserName } = useUser();

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      console.log('Received Kakao auth code:', code);
      console.log('KAKAO_CLIENT_ID:', process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID);
      console.log('KAKAO_REDIRECT_URI:', process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI);
      
      const handleKakaoCallback = async () => {
        try {
          console.log('Sending request to backend...');
          const response = await axios.post('http://localhost:8000/api/v1/auth/kakao/callback/', 
            { 
              code,
              redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI
            },
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          
          console.log('Backend response:', response.data);
          
          if (response.status === 200 && response.data) {
            console.log('Backend response:', response.data);
            
            // Store tokens and user data
            localStorage.setItem('token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);
            localStorage.setItem('user', response.data.user.name || response.data.user.email);
            
            // Update global state
            setUserName(response.data.user.name || response.data.user.email);
            
            // Redirect to home page
            router.replace('/');
          }
        } catch (error: any) {
          console.error('Kakao login error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            env: {
              clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
              redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI
            }
          });
          
          // 에러 메시지를 포함하여 리다이렉트
          const errorMessage = error.response?.data?.error || error.message;
          router.replace(`/login?error=kakao-login-failed&message=${encodeURIComponent(errorMessage)}`);
        }
      };

      handleKakaoCallback();
    } else {
      console.error('No authorization code received from Kakao');
      router.replace('/login?error=no-auth-code');
    }
  }, [searchParams, router, setUserName]);

  return null; // This component doesn't render anything
} 