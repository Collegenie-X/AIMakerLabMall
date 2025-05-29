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
import { getInquiries, Inquiry } from "@/services/inquiryService";
import { isAuthenticated, setTestToken } from "@/services/authService";

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
  const [inquiryItems, setInquiryItems] = useState<BoardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 문의 데이터 가져오기
  useEffect(() => {
    // 서버 사이드 렌더링에서는 실행하지 않음
    if (typeof window === 'undefined') return;
    
    // 테스트를 위해 인증되지 않은 상태면 테스트 토큰 설정
    if (!isAuthenticated()) {
      console.log('테스트 토큰 설정');
      setTestToken();
    }
    
    const fetchInquiries = async () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  // 새 문의 작성 페이지로 이동
  const handleAddInquiry = () => {
    router.push('/inquiries/create');
  };

  // 수업 문의 페이지로 이동
  const handleAddLessonInquiry = () => {
    router.push('/lessons/create');
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
          items={isLoading ? [] : inquiryItems}
          onAddClick={handleAddInquiry}
          maxItems={5}
          baseUrl="/inquiries"
        />
        <BoardList
          title="코딩 출강 및 수업 문의"
          items={lessonBoardItems}
          onAddClick={handleAddLessonInquiry}
          maxItems={5}
          baseUrl="/lessons"
        />
      </Container>
      <Statistics />
    </Box>
  );
} 