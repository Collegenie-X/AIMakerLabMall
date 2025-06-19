import axios from 'axios';

// API 기본 URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 사용자 타입 정의
export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
}

// 출강 문의 타입 정의
export interface OutreachInquiry {
  id: number;
  user?: User | null;
  title: string;
  requester_name: string;
  author_name?: string;
  phone?: string;
  email?: string;
  course_type: string;
  course_type_display?: string;
  student_count: number;
  student_grade?: string;
  preferred_date: string;
  preferred_time?: string;
  formatted_datetime?: string;
  duration?: string;
  duration_display?: string;
  location?: string;
  message?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  budget?: string;
  special_requests?: string;
  equipment?: string[];
  admin_notes?: string;
  is_owner?: boolean;
}

// 출강 문의 응답 타입 정의
export interface OutreachInquiryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OutreachInquiry[];
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
 * 출강 문의 목록을 가져오는 함수
 * API 서버로부터 출강 문의 목록 데이터를 가져옵니다.
 */
export const getOutreachInquiries = async (): Promise<OutreachInquiryResponse> => {
  try {
    // 헤더 설정
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // 토큰이 있는 경우에만 Authorization 헤더 추가 (선택적)
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await axios.get(`${API_URL}/outreach-inquiries/`, { headers });
    
    // 백엔드가 배열로 응답하므로 페이지네이션 형태로 변환
    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        next: null,
        previous: null,
        results: response.data
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('출강 문의 목록을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 페이지네이션이 적용된 출강 문의 목록을 가져오는 함수
 * 
 * @param page - 요청할 페이지 번호 (1부터 시작)
 * @param pageSize - 페이지당 아이템 수
 * @returns 페이지네이션이 적용된 출강 문의 응답 객체
 */
export const getPaginatedOutreachInquiries = async (
  page: number = 1, 
  pageSize: number = 10
): Promise<OutreachInquiryResponse> => {
  try {
    // 헤더 설정
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // 토큰이 있는 경우에만 Authorization 헤더 추가 (선택적)
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 페이지네이션 파라미터 설정
    const params = {
      page,
      page_size: pageSize
    };
    
    const response = await axios.get(`${API_URL}/outreach-inquiries/`, { 
      headers,
      params 
    });
    
    // 백엔드가 배열로 응답하므로 페이지네이션 형태로 변환
    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        next: null,
        previous: null,
        results: response.data
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('페이지네이션 출강 문의 목록을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 특정 ID의 출강 문의 상세 정보를 가져오는 함수
 * 
 * @param id - 조회할 출강 문의 ID
 * @returns 출강 문의 상세 정보 객체
 */
export const getOutreachInquiryById = async (id: number): Promise<OutreachInquiry> => {
  try {
    // 헤더 설정
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // 토큰이 있는 경우에만 Authorization 헤더 추가 (선택적)
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await axios.get(`${API_URL}/outreach-inquiries/${id}/`, { headers });
    
    return response.data;
  } catch (error: any) {
    console.error(`ID ${id}의 출강 문의 정보를 가져오는 중 오류 발생:`, error);
    throw error;
  }
};

/**
 * 새 출강 문의를 생성하는 함수
 * 
 * @param outreachInquiryData 출강 문의 데이터 객체
 * @returns 생성된 출강 문의 객체
 */
export interface CreateOutreachInquiryData {
  title: string;
  requester_name: string;
  phone: string;
  email: string;
  course_type: string;
  student_count: number;
  student_grade: string;
  preferred_date: string;
  preferred_time: string;
  duration: string;
  location: string;
  message: string;
  budget?: string;
  special_requests?: string;
}

export const createOutreachInquiry = async (
  outreachInquiryData: CreateOutreachInquiryData
): Promise<OutreachInquiry> => {
  try {
    // 헤더 설정
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // 토큰이 있는 경우에만 Authorization 헤더 추가 (비로그인 사용자도 생성 가능)
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await axios.post(
      `${API_URL}/outreach-inquiries/`, 
      outreachInquiryData,
      { headers }
    );
    
    return response.data;
  } catch (error) {
    console.error('출강 문의 생성 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 출강 문의 통계 정보를 가져오는 함수
 * 
 * @returns 출강 문의 통계 객체
 */
export interface OutreachInquiryStats {
  total_inquiries: number;
  total_students: number;
  status_breakdown: Record<string, number>;
  course_type_breakdown: Record<string, number>;
  pending_count: number;
  in_progress_count: number;
  completed_count: number;
}

export const getOutreachInquiryStats = async (): Promise<OutreachInquiryStats> => {
  try {
    // 헤더 설정
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // 토큰이 있는 경우에만 Authorization 헤더 추가 (선택적)
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await axios.get(`${API_URL}/outreach-inquiries/statistics/`, { headers });
    
    return response.data;
  } catch (error) {
    console.error('출강 문의 통계를 가져오는 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 최근 출강 문의 목록을 가져오는 함수 (최대 5개)
 * 
 * @returns 최근 출강 문의 배열
 */
export const getRecentOutreachInquiries = async (): Promise<OutreachInquiry[]> => {
  try {
    // 헤더 설정
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // 토큰이 있는 경우에만 Authorization 헤더 추가 (선택적)
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await axios.get(`${API_URL}/outreach-inquiries/recent/`, { headers });
    
    return response.data;
  } catch (error) {
    console.error('최근 출강 문의를 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 교육 과정 한글 매핑
export const getCourseTypeName = (courseType: string): string => {
  const courseTypeMap: Record<string, string> = {
    'app-inventor': '앱 인벤터',
    'arduino': '아두이노',
    'raspberry-pi': 'Raspberry Pi',
    'ai': 'AI 코딩',
    'python': '파이썬 코딩',
    'scratch': '스크래치',
    'web-development': '웹 개발',
    'game-development': '게임 개발',
    'data-science': '데이터 사이언스',
    'robotics': '로보틱스'
  };
  
  return courseTypeMap[courseType] || courseType;
};

// 상태 한글 매핑
export const getStatusName = (status: string): string => {
  const statusMap: Record<string, string> = {
    '접수대기': '접수대기',
    '검토중': '검토중',
    '견적발송': '견적발송',
    '확정': '확정',
    '진행중': '진행중',
    '완료': '완료',
    '취소': '취소'
  };
  
  return statusMap[status] || status;
}; 