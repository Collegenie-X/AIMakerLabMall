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
  reply?: string;
  reply_created_at?: string;
  reply_updated_at?: string;
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
 * 페이지네이션이 적용된 수업 문의 목록을 가져오는 함수
 * 
 * @param page - 요청할 페이지 번호 (1부터 시작)
 * @param pageSize - 페이지당 아이템 수
 * @returns 페이지네이션이 적용된 수업 문의 응답 객체
 */
export const getPaginatedLessonInquiries = async (page: number = 1, pageSize: number = 5): Promise<LessonInquiryResponse> => {
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
    
    const response = await axios.get(`${API_URL}/lessons/`, { 
      headers,
      params 
    });
    
    return response.data;
  } catch (error) {
    console.error('페이지네이션 수업 문의 목록을 가져오는 중 오류 발생:', error);
    
    // 임시 더미 데이터 반환 (API 오류 시)
    // 실제 페이지네이션 응답을 모방하기 위한 더미 데이터
    const dummyLessonInquiries = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      user: {
        id: 2,
        username: "admin",
        email: "admin@abc.com",
        display_name: "admin (admin@abc.com)"
      },
      title: `수업 문의 제목 ${i + 1}`,
      description: `수업 문의 내용 ${i + 1}`,
      inquiry_type: i % 2 === 0 ? "offline" : "online",
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
      updated_at: new Date(Date.now() - i * 86400000).toISOString(),
      requester_name: `작성자 ${i + 1}`,
      is_owner: false,
      target_audience: i % 2 === 0 ? "초등학교 4학년" : "중학교 1학년",
      preferred_date: `2025년 ${5 + i}월 중`,
      participant_count: 20 + i
    }));
    
    // 페이지네이션 계산
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = dummyLessonInquiries.slice(startIndex, endIndex);
    const totalCount = dummyLessonInquiries.length;
    
    // 다음 페이지와 이전 페이지 URL 설정
    const hasNext = endIndex < totalCount;
    const hasPrevious = page > 1;
    
    return {
      count: totalCount,
      next: hasNext ? `${API_URL}/lessons/?page=${page + 1}&page_size=${pageSize}` : null,
      previous: hasPrevious ? `${API_URL}/lessons/?page=${page - 1}&page_size=${pageSize}` : null,
      results: paginatedResults
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

/**
 * 특정 ID의 수업 문의 상세 정보를 가져오는 함수
 * 
 * @param id - 조회할 수업 문의 ID
 * @returns 수업 문의 상세 정보 객체
 * @throws {Error} 권한이 없거나 요청 실패 시 에러 발생
 */
export const getLessonInquiryById = async (id: number): Promise<LessonInquiry> => {
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
    
    const response = await axios.get(`${API_URL}/lessons/${id}/`, { headers });
    
    return response.data;
  } catch (error: any) {
    // 오류 정보 로깅
    console.error(`ID ${id}의 수업 문의 정보를 가져오는 중 오류 발생:`, error);
    
    // 403 Forbidden 에러 처리 - 그대로 오류 전달
    if (error.response && error.response.status === 403) {
      throw error;
    }
    
    // 임시 더미 데이터 반환 (API 오류 시)
    // ID에 따라 다른 더미 데이터 생성
    const dummyLessonInquiries = {
      1: {
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
        participant_count: 25,
        reply: "안녕하세요, 김규리님.\r\n\r\n초등학교 4학년 대상 코딩 출강 수업 문의 주셔서 감사합니다.\r\n\r\n해당 학년에 맞는 다양한 커리큘럼이 준비되어 있으며, 학생 수와 수업 횟수에 따라 견적이 달라집니다. 자세한 견적서와 커리큘럼 안내를 이메일로 발송해 드렸으니 확인 부탁드립니다.\r\n\r\n추가 문의사항이 있으시면 언제든지 연락주세요.\r\n\r\n감사합니다.",
        reply_created_at: "2025-04-26T10:15:22.456901+09:00",
        reply_updated_at: "2025-04-26T10:15:22.456901+09:00"
      },
      2: {
        id: 2,
        user: {
          id: 3,
          username: "teacher123",
          email: "teacher123@school.edu",
          display_name: "김교사"
        },
        title: "방과후 코딩 교실 문의",
        description: "중학교 1~2학년 대상으로 방과후 코딩 교실을 운영하려고 합니다. 주 2회, 3개월 과정으로 계획 중입니다. 가능한 날짜와 견적을 알려주세요.",
        inquiry_type: "offline",
        created_at: "2025-05-15T11:22:33.456901+09:00",
        updated_at: "2025-05-15T11:22:33.456901+09:00",
        requester_name: "김교사",
        is_owner: false,
        target_audience: "중학교 1~2학년",
        preferred_date: "2025년 9월~11월",
        participant_count: 20
      },
      3: {
        id: 3,
        user: {
          id: 4,
          username: "science_teacher",
          email: "science@school.edu",
          display_name: "과학교사"
        },
        title: "온라인 코딩 워크샵 문의",
        description: "코로나로 인해 온라인 코딩 워크샵을 계획 중입니다. 고등학교 1학년 학생 40명을 대상으로 하는 4시간 워크샵이 가능한지 문의드립니다.",
        inquiry_type: "online",
        created_at: "2025-05-20T14:30:15.123456+09:00",
        updated_at: "2025-05-20T14:30:15.123456+09:00",
        requester_name: "박과학",
        is_owner: false,
        target_audience: "고등학교 1학년",
        preferred_date: "2025년 7월 첫째 주",
        participant_count: 40,
        reply: "안녕하세요, 박과학 선생님.\r\n\r\n온라인 코딩 워크샵 문의 주셔서 감사합니다. 고등학교 1학년 학생 40명 대상 4시간 워크샵 진행 가능합니다.\r\n\r\n원하시는 7월 첫째 주에 가능하며, 화상회의 플랫폼과 사전 준비사항 등 자세한 내용을 이메일로 발송해 드렸습니다.\r\n\r\n추가 문의사항 있으시면 연락주세요.\r\n\r\n감사합니다.",
        reply_created_at: "2025-05-21T09:45:30.123456+09:00",
        reply_updated_at: "2025-05-21T09:45:30.123456+09:00"
      }
    };
    
    // 요청된 ID가 더미 데이터에 있으면 반환, 없으면 기본 더미 데이터 반환
    return dummyLessonInquiries[id as keyof typeof dummyLessonInquiries] || {
      id: id,
      user: {
        id: 2,
        username: "user",
        email: "user@example.com",
        display_name: "사용자"
      },
      title: `수업 문의 제목 ${id}`,
      description: `수업 문의 내용 ${id}에 대한 상세 설명입니다. 이 문의는 더미 데이터로 생성되었습니다.`,
      inquiry_type: id % 2 === 0 ? "offline" : "online",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      requester_name: `작성자 ${id}`,
      is_owner: false,
      target_audience: id % 2 === 0 ? "초등학교 3~4학년" : "중학교 1~2학년",
      preferred_date: `2025년 ${6 + (id % 6)}월`,
      participant_count: 20 + (id % 10)
    };
  }
}; 