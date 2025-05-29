import axios from 'axios';

// API 기본 URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 문의 타입 정의
export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
}

export interface LessonInquiry {
  id: number;
  user: User;
  title: string;
  description: string;
  inquiry_type: string;
  created_at: string;
  updated_at: string;
  requester_name: string;
  is_owner: boolean;
  target_audience: string;
  preferred_date: string;
  participant_count: number | null;
}

export interface LessonInquiryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LessonInquiry[];
}

/**
 * 로컬 스토리지에서 토큰을 안전하게 가져오는 함수
 */
const getToken = (): string | null => {
  // 브라우저 환경에서만 실행
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  } catch (error) {
    console.error('토큰 접근 오류:', error);
    return null;
  }
};

/**
 * 수업 문의 목록을 가져오는 함수
 * 
 * API 서버로부터 수업 문의 목록 데이터를 가져옵니다.
 * 목록 조회는 인증 없이도 가능합니다.
 */
export const getLessonInquiries = async (): Promise<LessonInquiryResponse> => {
  try {
    // 헤더 설정 - 목록 조회는 인증 없이도 가능하므로 기본 헤더만 설정
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // 토큰이 있는 경우에만 Authorization 헤더 추가 (선택적)
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await axios.get(`${API_URL}/lessons/`, { headers });
    
    return response.data;
  } catch (error) {
    console.error('수업 문의 목록을 가져오는 중 오류 발생:', error);
    
    // 임시 더미 데이터 반환 (API 오류 시)
    return {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          user: {
            id: 2,
            username: "admin",
            email: "admin@abc.com",
            display_name: "admin (admin@abc.com)"
          },
          title: "견적 문의 드립니다.",
          description: "초등학교 4학년 학생들을 위한 코딩 출강 수업이 필요합니다.",
          inquiry_type: "offline",
          created_at: "2025-04-25T13:32:36.456901+09:00",
          updated_at: "2025-04-25T13:32:36.456935+09:00",
          requester_name: "김규리",
          is_owner: false,
          target_audience: "초등학교 4학년",
          preferred_date: "2025년 5월 중",
          participant_count: 25
        }
      ]
    };
  }
};

/**
 * 새 수업 문의를 생성하는 함수
 * 
 * 사용자가 작성한 수업 문의 정보를 서버에 전송합니다.
 * 인증된 사용자만 문의를 생성할 수 있습니다.
 * 
 * @param lessonInquiryData 수업 문의 데이터 객체
 * @returns 생성된 수업 문의 객체
 */
export interface CreateLessonInquiryData {
  title: string;
  description: string;
  inquiry_type: string;
  requester_name: string;
  target_audience?: string;
  preferred_date?: string;
  participant_count?: number;
}

export const createLessonInquiry = async (lessonInquiryData: CreateLessonInquiryData): Promise<LessonInquiry> => {
  try {
    // 토큰 가져오기 (인증 필요)
    const token = getToken();
    
    if (!token) {
      throw new Error('인증이 필요합니다. 로그인 후 이용해주세요.');
    }
    
    // 헤더 설정
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    const response = await axios.post(
      `${API_URL}/lessons/create/`, 
      lessonInquiryData,
      { headers }
    );
    
    return response.data;
  } catch (error) {
    console.error('수업 문의 생성 중 오류 발생:', error);
    throw error;
  }
}; 