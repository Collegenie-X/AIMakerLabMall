'use client';

import { Box , Container} from "@mui/material";
import HeroBanner from "@/components/domain/HeroBanner";
import MenuShortcuts from "@/components/domain/MenuShortcuts";
import ProductSection from "@/components/layout/ProductSection";
import BoardList from "@/components/domain/Board/BoardList";
import Statistics from "@/components/domain/Statistics";
import { Slide } from "@/services/slidesService";
import ProductListContainer from "@/components/domain/ProductListContainer";

// 카테고리 링크
const categoryLinks = [
  { label: "수업자료 보기", url: "/resources" },
  { label: "지도 계획서 보기", url: "/plans" },
  { label: "소스 코드 다운로드", url: "/downloads" }
];

// 게시판 데이터
const inquiryBoardItems = [
  {
    icon: 'key',
    category: '교구문의',
    title: '견적 문의 드립니다.',
    date: '2025.04.25',
    author: '김규리'
  }
];

const lessonBoardItems = [
  {
    icon: 'key',
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
          items={inquiryBoardItems}
          onAddClick={() => console.log('Add inquiry clicked')}
        />
        <BoardList
          title="코딩 출강 및 수업 문의"
          items={lessonBoardItems}
          onAddClick={() => console.log('Add lesson inquiry clicked')}
        />
      </Container>
      <Statistics />
    </Box>
  );
} 