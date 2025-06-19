import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography } from '@mui/material';
import {
  HourglassEmpty as HourglassEmptyIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { BoardItem } from '../types/board';
import { API_CONFIG, apiHelpers } from '../config/api';
import PaginatedBoardList from '../components/shared/PaginatedBoardList';
import ApiTestComponent from '../components/debug/ApiTestComponent';

/**
 * 현재 사용자 정보 가져오기
 */
const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * 홈페이지 컴포넌트
 */
const HomePage: React.FC = () => {
  const [inquiryItems, setInquiryItems] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * 문의 목록 조회
   */
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      
      const apiUrl = apiHelpers.getFullUrl(`${API_CONFIG.ENDPOINTS.OUTREACH_INQUIRIES}/recent/`);
      console.log('🚀 API 호출 시작:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors' // CORS 모드 명시적 설정
      });

      console.log('📡 API 응답 상태:', response.status);

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 받은 데이터:', data);
      console.log('📊 데이터 개수:', data.length);
      
      const currentUser = getCurrentUser();
      console.log('👤 현재 사용자:', currentUser);
      
      // API 응답을 BoardItem 형식으로 변환하고 is_owner 계산
      const transformedData: BoardItem[] = data.map((item: any) => {
        // author_name을 기준으로 is_owner 판단
        let isOwner = false;
        if (currentUser) {
          // author_name이 현재 사용자의 username과 일치하면 소유자
          isOwner = item.author_name === currentUser.username;
        }

        return {
          id: item.id,
          title: item.title,
          requester_name: item.requester_name,
          author_name: item.author_name,
          course_type: item.course_type,
          student_count: item.student_count,
          status: item.status,
          created_at: item.created_at,
          is_owner: isOwner,
          can_edit: isOwner || (currentUser && currentUser.is_staff)
        };
      });

      console.log('✅ 변환된 데이터:', transformedData);
      setInquiryItems(transformedData);
      
    } catch (error) {
      console.error('❌ 문의 목록 조회 오류:', error);
      // 에러 시 빈 배열로 설정
      setInquiryItems([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 컴포넌트 마운트 시 데이터 조회
   */
  useEffect(() => {
    fetchInquiries();
  }, []);

  // 상태별 아이콘 매핑
  const iconMap = {
    '접수대기': HourglassEmptyIcon,
    '검토중': SearchIcon,
    '완료': CheckCircleIcon
  };

  // 교육 과정 한글명 매핑
  const inquiryTypeMap = {
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* API 테스트 컴포넌트 (디버깅용) */}
      <ApiTestComponent />
      
      {/* 헤더 */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          AI Maker Lab
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          학교, 기관, 단체를 대상으로 전문 강사가 직접 찾아가는 맞춤형 코딩 교육 서비스입니다.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          언제든지 문의해 주시면 최적의 교육 프로그램을 제안해 드리겠습니다.
        </Typography>
      </Box>

      {/* 메인 콘텐츠 */}
      <Grid container spacing={4}>
        {/* 코딩 출강 교육 문의 목록 */}
        <Grid item xs={12} md={6}>
          <PaginatedBoardList
            title="📋 코딩 출강 교육 문의 목록"
            items={inquiryItems}
            loading={loading}
            baseUrl="/inquiries"
            iconMap={iconMap}
            inquiryTypeMap={inquiryTypeMap}
            showViewAll={true}
            maxHeight="400px"
            showOnlyOwnerDetails={true}
          />
        </Grid>

        {/* 교육 키트 구매 견적 문의 */}
        <Grid item xs={12} md={6}>
          <PaginatedBoardList
            title="🛒 교육 키트 구매 견적 문의"
            items={[]}  // 교육 키트 문의는 별도 API로 관리
            loading={false}
            baseUrl="/products"
            showViewAll={false}
          />
        </Grid>
      </Grid>

      {/* 통계 섹션 (선택사항) */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                {loading ? '-' : inquiryItems.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                총 문의
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 3, bgcolor: 'success.50', borderRadius: 2 }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                {loading ? '-' : inquiryItems.filter(item => item.status === '완료').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                완료된 교육
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 3, bgcolor: 'warning.50', borderRadius: 2 }}>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
                {loading ? '-' : inquiryItems.filter(item => 
                  ['접수대기', '검토중', '견적발송', '확정', '진행중'].includes(item.status)
                ).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                진행 중인 문의
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage; 