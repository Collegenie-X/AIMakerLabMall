'use client';

import { Box, Container, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from "@mui/material";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeroBanner from "@/components/domain/HeroBanner";
import MenuShortcuts from "@/components/domain/MenuShortcuts";
import ProductSection from "@/components/layout/ProductSection";
import { BoardItem } from "@/components/domain/Board/BoardList";
import Statistics from "@/components/domain/Statistics";
import { Slide } from "@/services/slidesService";
import ProductListContainer from "@/components/domain/ProductListContainer";
import { getInquiries, getPaginatedInquiries } from "@/services/inquiryService";
import InquiryDialog from "@/components/domain/Board/InquiryDialog";
import PaginatedBoardList from "@/components/domain/Board/PaginatedBoardList";
import { Business, Add, CalendarMonth } from "@mui/icons-material";

// 카테고리 링크
const categoryLinks = [
  { label: "수업자료 보기", url: "/resources" },
  { label: "지도 계획서 보기", url: "/plans" },
  { label: "소스 코드 다운로드", url: "/downloads" }
];

// 코딩 출강 교육 문의 데이터 (정적 데이터)
const outreachInquiryItems = [
  {
    id: 1,
    title: '초등학교 3학년 대상 앱 인벤터 교육',
    organizationName: '서울초등학교',
    contactPerson: '김선생',
    courseType: 'app-inventor',
    studentCount: 25,
    status: '접수대기',
    createdAt: '2025.05.29'
  },
  {
    id: 2,
    title: '중학교 아두이노 IoT 프로젝트 수업',
    organizationName: '강남중학교', 
    contactPerson: '이담임',
    courseType: 'arduino',
    studentCount: 30,
    status: '검토중',
    createdAt: '2025.05.29'
  },
  {
    id: 3,
    title: '고등학교 Python AI 기초 교육',
    organizationName: '명덕고등학교',
    contactPerson: '박교사',
    courseType: 'python',
    studentCount: 35,
    status: '견적발송',
    createdAt: '2025.05.28'
  }
];

interface HomeContentProps {
  slides: Slide[];
}

/**
 * 교육 과정명 반환
 */
const getCourseTypeName = (courseType: string) => {
  switch (courseType) {
    case 'app-inventor': return '앱 인벤터';
    case 'arduino': return '아두이노';
    case 'raspberry-pi': return 'Raspberry Pi';
    case 'ai': return 'AI 코딩';
    case 'python': return '파이썬 코딩';
    default: return courseType;
  }
};

/**
 * 상태별 색상 반환
 */
const getStatusColor = (status: string) => {
  switch (status) {
    case '접수대기': return '#9e9e9e';
    case '검토중': return '#ff9800';
    case '견적발송': return '#2196f3';
    case '확정': return '#4caf50';
    case '완료': return '#8bc34a';
    default: return '#9e9e9e';
  }
};

/**
 * 코딩 출강 교육 문의 컴포넌트
 */
function OutreachInquirySection() {
  const router = useRouter();

  const handleRowClick = () => {
    router.push('/inquiry/contact');
  };

  const handleAddClick = () => {
    router.push('/inquiry/contact');
  };

  return (
    <Card sx={{ width: '100%', boxShadow: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            코딩 출강 및 수업 문의
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
            size="small"
            sx={{ 
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              fontSize: '0.8rem'
            }}
          >
            새 문의
          </Button>
        </Box>
        
        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 'bold', width: '45%' }}>제목 / 기관명</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>담당자</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>교육과정</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outreachInquiryItems.map((inquiry) => (
                <TableRow 
                  key={inquiry.id}
                  onClick={handleRowClick}
                  sx={{ 
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {inquiry.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Business sx={{ fontSize: 14, mr: 0.5, color: '#666' }} />
                      <Typography variant="caption" color="text.secondary">
                        {inquiry.organizationName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {inquiry.contactPerson}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {inquiry.studentCount}명
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getCourseTypeName(inquiry.courseType)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={inquiry.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(inquiry.status),
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.7rem'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {inquiry.createdAt}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleRowClick}
            sx={{ fontSize: '0.8rem' }}
          >
            전체 목록 보기
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
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
        <OutreachInquirySection />
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