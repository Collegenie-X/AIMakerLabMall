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

export interface Inquiry {
  id: number;
  user: User;
  title: string;
  description: string;
  inquiry_type: string;
  created_at: string;
  updated_at: string;
  requester_name: string;
  is_owner: boolean;
}

export interface InquiryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Inquiry[];
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
 * 문의 목록을 가져오는 함수
 * 
 * API 서버로부터 문의 목록 데이터를 가져옵니다.
 * 목록 조회는 인증 없이도 가능합니다.
 */
export const getInquiries = async (): Promise<InquiryResponse> => {
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
    
    const response = await axios.get(`${API_URL}/inquiries/`, { headers });
    
    return response.data;
  } catch (error) {
    console.error('문의 목록을 가져오는 중 오류 발생:', error);
    
    // 임시 더미 데이터 반환 (API 오류 시)
    return {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 2,
          user: {
            id: 2,
            username: "admin",
            email: "admin@abc.com",
            display_name: "admin (admin@abc.com)"
          },
          title: "스마트 팜 100개 문의",
          description: "스마트 팜 대량 구매가 가능할까요?  내일 모레 써야 해요.",
          inquiry_type: "product",
          created_at: "2025-05-29T13:32:36.456901+09:00",
          updated_at: "2025-05-29T13:32:36.456935+09:00",
          requester_name: "일산고등학교 김종필 선생님",
          is_owner: false
        },
        {
          id: 1,
          user: {
            id: 3,
            username: "jpdarrencompany@gmail.com",
            email: "jpdarrencompany@gmail.com",
            display_name: "jpdarrencompany@gmail.com (jpdarrencompany@gmail.com)"
          },
          title: "스마트 홈 100개 주문",
          description: "안녕하세요. \r\n\r\n스마트 홈 100개를 6학년 수업으로 진행하려고 합니다.\r\n교육 키트만 구매하고 싶은데요. \r\n가능할까요?  하나의 카드 결제로 하고 싶습니다.  \r\n\r\n대량 구매이기때문에, 가격 할인이 될까요?",
          inquiry_type: "price",
          created_at: "2025-05-29T11:30:48.106763+09:00",
          updated_at: "2025-05-29T13:17:13.187313+09:00",
          requester_name: "대구초등학교 김종필 교사",
          is_owner: false
        }
      ]
    };
  }
};

/**
 * 새 문의를 생성하는 함수
 * 
 * 사용자가 작성한 문의 정보를 서버에 전송합니다.
 * 인증된 사용자만 문의를 생성할 수 있습니다.
 * 
 * @param inquiryData 문의 데이터 객체
 * @returns 생성된 문의 객체
 */
export interface CreateInquiryData {
  title: string;
  description: string;
  inquiry_type: string;
  requester_name: string;
}

export const createInquiry = async (inquiryData: CreateInquiryData): Promise<Inquiry> => {
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
      `${API_URL}/inquiries/create/`, 
      inquiryData,
      { headers }
    );
    
    return response.data;
  } catch (error) {
    console.error('문의 생성 중 오류 발생:', error);
    throw error;
  }
}; 