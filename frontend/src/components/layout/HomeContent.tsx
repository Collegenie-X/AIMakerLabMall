'use client';

import { Box, Container } from "@mui/material";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeroBanner from "@/components/domain/HeroBanner";
import MenuShortcuts from "@/components/domain/MenuShortcuts";
import ProductSection from "@/components/layout/ProductSection";
import { BoardItem } from "@/components/domain/Board/BoardList";
import Statistics from "@/components/domain/Statistics";
import { Slide } from "@/services/slidesService";
import ProductListContainer from "@/components/domain/ProductListContainer";
import { getPaginatedInquiries } from "@/services/inquiryService";
import InquiryDialog from "@/components/domain/Board/InquiryDialog";
import PaginatedBoardList from "@/components/domain/Board/PaginatedBoardList";

// 카테고리 링크
const categoryLinks = [
  { label: "수업자료 보기", url: "/resources" },
  { label: "지도 계획서 보기", url: "/plans" },
  { label: "소스 코드 다운로드", url: "/downloads" }
];

// 코딩 출강 교육 문의 데이터 (정적 데이터) - BoardItem 형태로 변환
const outreachInquiryItems: BoardItem[] = [
  {
    id: 1,
    title: '초등학교 3학년 대상 앱 인벤터 교육',
    inquiry_type: 'waiting',
    created_at: '2025-05-29T00:00:00Z',
    requester_name: '김선생',
  },
  {
    id: 2,
    title: '중학교 아두이노 IoT 프로젝트 수업',
    inquiry_type: 'reviewing',
    created_at: '2025-05-29T00:00:00Z',
    requester_name: '이담임',
  },
  {
    id: 3,
    title: '고등학교 Python AI 기초 교육',
    inquiry_type: 'completed',
    created_at: '2025-05-28T00:00:00Z',
    requester_name: '박교사',
  }
];

interface HomeContentProps {
  slides: Slide[];
}

/**
 * 홈페이지 메인 컨텐츠 컴포넌트
 * 
 * @param slides - 슬라이드 이미지 데이터
 * @returns 홈페이지 메인 컨텐츠 컴포넌트
 */
export default function HomeContent({ slides }: HomeContentProps) {
  const router = useRouter();
  
  // 교육 키트 문의 상태
  const [inquiryItems, setInquiryItems] = useState<BoardItem[]>([]);
  const [isInquiryLoading, setIsInquiryLoading] = useState<boolean>(true);
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState<boolean>(false);
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    // 서버 사이드 렌더링에서는 실행하지 않음
    if (typeof window === 'undefined') return;
    
    fetchInquiries();
  }, []);
  
  // 교육 키트 문의 데이터 가져오기
  const fetchInquiries = async () => {
    try {
      setIsInquiryLoading(true);
      // 페이지네이션 적용된 데이터 가져오기
      const response = await getPaginatedInquiries(1, 10);
      
      // API 응답을 BoardItem 형식으로 변환
      const formattedItems: BoardItem[] = response.results.map(inquiry => ({
        id: inquiry.id,
        inquiry_type: inquiry.inquiry_type,
        title: inquiry.title,
        created_at: inquiry.created_at,
        requester_name: inquiry.requester_name,
      }));
      
      setInquiryItems(formattedItems);
    } catch (error) {
      console.error('문의 데이터 로딩 오류:', error);
      setInquiryItems([]);
    } finally {
      setIsInquiryLoading(false);
    }
  };

  // 새 문의 작성 다이얼로그 열기
  const handleAddInquiry = () => {
    setInquiryDialogOpen(true);
  };

  // 코딩 출강 문의 작성 페이지로 이동
  const handleAddOutreachInquiry = () => {
    router.push('/inquiry/contact');
  };

  /**
   * 코딩 출강 문의 아이템 클릭 핸들러
   * - ID에 상관없이 항상 문의 작성 페이지로 이동
   */
  const handleOutreachItemClick = () => {
    router.push('/inquiry/contact');
  };

  return (
    <Box>
      <HeroBanner initialSlides={slides} />
      
      <MenuShortcuts />
      <ProductSection
        categoryTitle="학년별 & 주제별 베스트 키트 추천"
        categoryLinks={categoryLinks}
        products={<ProductListContainer title="교육 키트 목록" />}
      />
      <Container maxWidth="lg" sx={{ display: 'flex', gap: 3, mt: 4, px: 2, justifyContent: 'space-between' }}>
        <PaginatedBoardList
          title="교육 키트 구매 견적 문의"
          items={isInquiryLoading ? [] : inquiryItems}
          onAddClick={handleAddInquiry}
          itemsPerPage={5}
          baseUrl="/inquiries"
        />
        <PaginatedBoardList
          title="코딩 출강 및 수업 문의"
          items={outreachInquiryItems}
          onAddClick={handleAddOutreachInquiry}
          itemsPerPage={5}
          baseUrl="/inquiry/contact"
          onItemClick={handleOutreachItemClick}
        />
      </Container>
      <Statistics />
      
      {/* 교육 키트 문의 생성 다이얼로그 */}
      <InquiryDialog
        open={inquiryDialogOpen}
        onClose={() => setInquiryDialogOpen(false)}
        onSuccess={() => {
          // 문의 생성 후 목록 새로고침
          fetchInquiries();
        }}
      />
    </Box>
  );
} 