'use client';

import { Box, Container } from "@mui/material";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeroBanner from "@/components/domain/HeroBanner";
import MenuShortcuts from "@/components/domain/MenuShortcuts";
import ProductSection from "@/components/layout/ProductSection";
import BoardList, { BoardItem } from "@/components/domain/Board/BoardList";
import Statistics from "@/components/domain/Statistics";
import { Slide } from "@/services/slidesService";
import ProductListContainer from "@/components/domain/ProductListContainer";
import { getInquiries } from "@/services/inquiryService";
import InquiryDialog from "@/components/domain/Board/InquiryDialog";
import { getLessonInquiries } from "@/services/lessonService";
import LessonInquiryDialog from "@/components/domain/Board/LessonInquiryDialog";

// 카테고리 링크
const categoryLinks = [
  { label: "수업자료 보기", url: "/resources" },
  { label: "지도 계획서 보기", url: "/plans" },
  { label: "소스 코드 다운로드", url: "/downloads" }
];

// 기본 수업 문의 데이터
const lessonBoardItems = [
  {
    icon: 'school',
    category: '대면 수업 문의',
    title: '견적 문의 드립니다.',
    date: '2025.04.25',
    author: '김규리'
  }
];

interface HomeContentProps {
  slides: Slide[];
}

export default function HomeContent({ slides }: HomeContentProps) {
  const router = useRouter();
  
  // 교육 키트 문의 상태
  const [inquiryItems, setInquiryItems] = useState<BoardItem[]>([]);
  const [isInquiryLoading, setIsInquiryLoading] = useState<boolean>(true);
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState<boolean>(false);
  
  // 수업 문의 상태
  const [lessonItems, setLessonItems] = useState<BoardItem[]>([]);
  const [isLessonLoading, setIsLessonLoading] = useState<boolean>(true);
  const [lessonDialogOpen, setLessonDialogOpen] = useState<boolean>(false);
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    // 서버 사이드 렌더링에서는 실행하지 않음
    if (typeof window === 'undefined') return;
    
    fetchInquiries();
    fetchLessonInquiries();
  }, []);
  
  // 교육 키트 문의 데이터 가져오기
  const fetchInquiries = async () => {
    try {
      setIsInquiryLoading(true);
      const response = await getInquiries();
      
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
  
  // 수업 문의 데이터 가져오기
  const fetchLessonInquiries = async () => {
    try {
      setIsLessonLoading(true);
      const response = await getLessonInquiries();
      
      // API 응답을 BoardItem 형식으로 변환
      const formattedItems: BoardItem[] = response.results.map(inquiry => ({
        id: inquiry.id,
        inquiry_type: inquiry.inquiry_type,
        title: inquiry.title,
        created_at: inquiry.created_at,
        requester_name: inquiry.requester_name,
      }));
      
      setLessonItems(formattedItems);
    } catch (error) {
      console.error('수업 문의 데이터 로딩 오류:', error);
      setLessonItems([]);
    } finally {
      setIsLessonLoading(false);
    }
  };

  // 새 문의 작성 다이얼로그 열기
  const handleAddInquiry = () => {
    setInquiryDialogOpen(true);
  };

  // 새 수업 문의 작성 다이얼로그 열기
  const handleAddLessonInquiry = () => {
    setLessonDialogOpen(true);
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
        <BoardList
          title="교육 키트 구매 견적 문의"
          items={isInquiryLoading ? [] : inquiryItems}
          onAddClick={handleAddInquiry}
          maxItems={5}
          baseUrl="/inquiries"
        />
        <BoardList
          title="코딩 출강 및 수업 문의"
          items={isLessonLoading ? [] : lessonItems}
          onAddClick={handleAddLessonInquiry}
          maxItems={5}
          baseUrl="/lessons"
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
      
      {/* 수업 문의 생성 다이얼로그 */}
      <LessonInquiryDialog
        open={lessonDialogOpen}
        onClose={() => setLessonDialogOpen(false)}
        onSuccess={() => {
          // 문의 생성 후 목록 새로고침
          fetchLessonInquiries();
        }}
      />
    </Box>
  );
} 