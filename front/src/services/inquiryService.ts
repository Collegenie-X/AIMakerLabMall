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
  reply?: string;
  reply_created_at?: string;
  reply_updated_at?: string;
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
 * 페이지네이션이 적용된 문의 목록을 가져오는 함수
 * 
 * @param page - 요청할 페이지 번호 (1부터 시작)
 * @param pageSize - 페이지당 아이템 수
 * @returns 페이지네이션이 적용된 문의 응답 객체
 */
export const getPaginatedInquiries = async (page: number = 1, pageSize: number = 5): Promise<InquiryResponse> => {
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
    
    const response = await axios.get(`${API_URL}/inquiries/`, { 
      headers,
      params 
    });
    
    return response.data;
  } catch (error) {
    console.error('페이지네이션 문의 목록을 가져오는 중 오류 발생:', error);
    
    // 임시 더미 데이터 반환 (API 오류 시)
    // 실제 페이지네이션 응답을 모방하기 위한 더미 데이터
    const dummyInquiries = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      user: {
        id: 2,
        username: "admin",
        email: "admin@abc.com",
        display_name: "admin (admin@abc.com)"
      },
      title: `문의 제목 ${i + 1}`,
      description: `문의 내용 ${i + 1}`,
      inquiry_type: i % 2 === 0 ? "product" : "price",
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
      updated_at: new Date(Date.now() - i * 86400000).toISOString(),
      requester_name: `작성자 ${i + 1}`,
      is_owner: false
    }));
    
    // 페이지네이션 계산
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = dummyInquiries.slice(startIndex, endIndex);
    const totalCount = dummyInquiries.length;
    
    // 다음 페이지와 이전 페이지 URL 설정
    const hasNext = endIndex < totalCount;
    const hasPrevious = page > 1;
    
    return {
      count: totalCount,
      next: hasNext ? `${API_URL}/inquiries/?page=${page + 1}&page_size=${pageSize}` : null,
      previous: hasPrevious ? `${API_URL}/inquiries/?page=${page - 1}&page_size=${pageSize}` : null,
      results: paginatedResults
    };
  }
};

/**
 * 특정 ID의 문의 상세 정보를 가져오는 함수
 * 
 * @param id - 조회할 문의 ID
 * @returns 문의 상세 정보 객체
 * @throws {Error} 권한이 없거나 요청 실패 시 에러 발생
 */
export const getInquiryById = async (id: number): Promise<Inquiry> => {
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
    
    const response = await axios.get(`${API_URL}/inquiries/${id}/`, { headers });
    
    return response.data;
  } catch (error: any) {
    // 오류 정보 로깅
    console.error(`ID ${id}의 문의 정보를 가져오는 중 오류 발생:`, error);
    
    // 403 Forbidden 에러 처리 - 그대로 오류 전달
    if (error.response && error.response.status === 403) {
      throw error;
    }
    
    // 임시 더미 데이터 반환 (API 오류 시)
    // ID에 따라 다른 더미 데이터 생성
    const dummyInquiries = {
      1: {
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
        is_owner: false,
        reply: "안녕하세요, 대구초등학교 김종필 선생님.\r\n\r\n스마트 홈 키트 100개 문의 주셔서 감사합니다. 대량 구매 가능하며, 카드 결제도 가능합니다.\r\n\r\n100개 이상 구매 시 10% 할인 적용해 드리고 있습니다. 자세한 견적은 별도로 이메일로 발송해 드리겠습니다.\r\n\r\n추가 문의사항 있으시면 언제든 연락주세요.\r\n\r\n감사합니다.",
        reply_created_at: "2025-05-30T09:12:25.187313+09:00",
        reply_updated_at: "2025-05-30T09:12:25.187313+09:00"
      },
      2: {
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
      3: {
        id: 3,
        user: {
          id: 4,
          username: "school_teacher",
          email: "teacher@school.edu",
          display_name: "학교 선생님"
        },
        title: "아두이노 키트 대량 구매 문의",
        description: "안녕하세요,\r\n\r\n저희 학교에서 아두이노 코딩 수업을 진행하려고 합니다. 아두이노 기초 키트 30개와 심화 키트 10개를 구매하고 싶습니다.\r\n\r\n학교 구매이기 때문에 세금계산서 발행이 필요하며, 배송일정과 대량 구매 할인 가능 여부도 알려주시면 감사하겠습니다.\r\n\r\n빠른 답변 부탁드립니다.",
        inquiry_type: "product",
        created_at: "2025-06-02T09:15:22.123456+09:00",
        updated_at: "2025-06-02T09:15:22.123456+09:00",
        requester_name: "서울중학교 이수연 교사",
        is_owner: false,
        reply: "안녕하세요, 서울중학교 이수연 선생님.\r\n\r\n아두이노 키트 관련 문의 주셔서 감사합니다. 요청하신 아두이노 기초 키트 30개와 심화 키트 10개 모두 재고 확보되어 있습니다.\r\n\r\n학교 구매용 세금계산서 발행 가능하며, 30개 이상 구매 시 8% 할인을 적용해 드립니다. 배송은 결제 완료 후 2-3일 내에 가능합니다.\r\n\r\n자세한 견적서를 이메일로 발송해 드렸으니 확인 부탁드립니다.\r\n\r\n감사합니다.",
        reply_created_at: "2025-06-03T10:25:18.123456+09:00",
        reply_updated_at: "2025-06-03T10:25:18.123456+09:00"
      }
    };
    
    // 요청된 ID가 더미 데이터에 있으면 반환, 없으면 기본 더미 데이터 반환
    return dummyInquiries[id as keyof typeof dummyInquiries] || {
      id: id,
      user: {
        id: 2,
        username: "user",
        email: "user@example.com",
        display_name: "사용자"
      },
      title: `문의 제목 ${id}`,
      description: `문의 내용 ${id}에 대한 상세 설명입니다. 이 문의는 더미 데이터로 생성되었습니다.`,
      inquiry_type: id % 2 === 0 ? "product" : "price",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      requester_name: `작성자 ${id}`,
      is_owner: false
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