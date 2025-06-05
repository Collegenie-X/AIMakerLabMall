import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * 내부 교육 수업 API 서비스
 */
class ClassService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/internal-classes`;
    this.inquiryURL = `${API_BASE_URL}/outreach-inquiries`;
  }

  /**
   * 모든 활성 수업 목록 조회
   * @param {Object} params - 필터링 및 정렬 파라미터
   * @returns {Promise} API 응답
   */
  async getAllClasses(params = {}) {
    try {
      const response = await axios.get(this.baseURL + '/', { params });
      return response.data;
    } catch (error) {
      console.error('수업 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 수업 상세 정보 조회
   * @param {number} classId - 수업 ID
   * @returns {Promise} API 응답
   */
  async getClassDetail(classId) {
    try {
      const response = await axios.get(`${this.baseURL}/${classId}/`);
      return response.data;
    } catch (error) {
      console.error('수업 상세 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 신청 가능한 수업 목록 조회
   * @returns {Promise} API 응답
   */
  async getAvailableClasses() {
    try {
      const response = await axios.get(`${this.baseURL}/available/`);
      return response.data;
    } catch (error) {
      console.error('신청 가능한 수업 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 교육 과정별 수업 목록 조회
   * @param {string} courseType - 교육 과정 타입
   * @returns {Promise} API 응답
   */
  async getClassesByCourseType(courseType) {
    try {
      const response = await axios.get(`${this.baseURL}/by_course_type/`, {
        params: { course_type: courseType }
      });
      return response.data;
    } catch (error) {
      console.error('교육 과정별 수업 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 인기 수업 목록 조회
   * @returns {Promise} API 응답
   */
  async getPopularClasses() {
    try {
      const response = await axios.get(`${this.baseURL}/popular/`);
      return response.data;
    } catch (error) {
      console.error('인기 수업 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 수업 신청 (OutreachInquiry로 변환)
   * @param {number} classId - 수업 ID
   * @param {Object} enrollmentData - 신청 정보
   * @returns {Promise} API 응답
   */
  async enrollInClass(classId, enrollmentData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${classId}/enroll/`,
        enrollmentData
      );
      return response.data;
    } catch (error) {
      console.error('수업 신청 실패:', error);
      throw error;
    }
  }

  /**
   * 출강 수업 문의 생성
   * @param {Object} inquiryData - 문의 데이터
   * @returns {Promise} API 응답
   */
  async createOutreachInquiry(inquiryData) {
    try {
      const response = await axios.post(`${this.inquiryURL}/`, inquiryData);
      return response.data;
    } catch (error) {
      console.error('출강 수업 문의 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 수업 문의 목록 조회 (통합)
   * @param {Object} params - 필터링 파라미터
   * @returns {Promise} API 응답
   */
  async getInquiries(params = {}) {
    try {
      const response = await axios.get(`${this.inquiryURL}/`, { params });
      return response.data;
    } catch (error) {
      console.error('수업 문의 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 수업 문의 상세 조회
   * @param {number} inquiryId - 문의 ID
   * @returns {Promise} API 응답
   */
  async getInquiryDetail(inquiryId) {
    try {
      const response = await axios.get(`${this.inquiryURL}/${inquiryId}/`);
      return response.data;
    } catch (error) {
      console.error('수업 문의 상세 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 수업 문의 상태 업데이트
   * @param {number} inquiryId - 문의 ID
   * @param {string} status - 새로운 상태
   * @returns {Promise} API 응답
   */
  async updateInquiryStatus(inquiryId, status) {
    try {
      const response = await axios.patch(
        `${this.inquiryURL}/${inquiryId}/update_status/`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('수업 문의 상태 업데이트 실패:', error);
      throw error;
    }
  }

  /**
   * 수업 문의 통계 정보 조회
   * @returns {Promise} API 응답
   */
  async getInquiryStatistics() {
    try {
      const response = await axios.get(`${this.inquiryURL}/statistics/`);
      return response.data;
    } catch (error) {
      console.error('수업 문의 통계 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 최근 수업 문의 목록 조회
   * @returns {Promise} API 응답
   */
  async getRecentInquiries() {
    try {
      const response = await axios.get(`${this.inquiryURL}/recent/`);
      return response.data;
    } catch (error) {
      console.error('최근 수업 문의 조회 실패:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const classService = new ClassService();
export default classService; 