'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  userName: string | null;
  setUserName: (name: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // 초기 로드 시 localStorage에서 사용자 정보 가져오기
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserName(storedUser);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 