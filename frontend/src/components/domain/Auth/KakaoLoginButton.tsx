'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';

interface KakaoLoginButtonProps {
  onClick?: () => void;
}

const StyledButton = styled.button`
  width: 300px;
  height: 45px;
  background-color: #FEE500;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #FDD835;
  }
`;

const ButtonText = styled.span`
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  margin-left: 8px;
`;

export default function KakaoLoginButton({ onClick }: KakaoLoginButtonProps) {
  const handleLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <StyledButton onClick={handleLogin}>
      <Image 
        src="/images/kakao-logo.png" 
        alt="Kakao Logo" 
        width={20} 
        height={20}
      />
      <ButtonText>카카오로 시작하기</ButtonText>
    </StyledButton>
  );
}
