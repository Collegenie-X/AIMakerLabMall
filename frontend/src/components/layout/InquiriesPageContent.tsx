'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { BoardItem } from '@/components/domain/Board/BoardList';
import { getPaginatedInquiries } from '@/services/inquiryService';
import PaginatedBoardList from '@/components/domain/Board/PaginatedBoardList';
import InquiryDialog from '@/components/domain/Board/InquiryDialog';

/**
 * 교육 키트 문의 페이지 컨텐츠 컴포넌트
 * 
 * @returns 교육 키트 문의 페이지 컨텐츠
 */
export default function InquiriesPageContent() {
  // 페이지 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // 문의 데이터 상태
  const [inquiryItems, setInquiryItems] = useState<BoardItem[]>([]);
  const [isInquiryLoading, setIsInquiryLoading] = useState<boolean>(true);
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState<boolean>(false);
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    // 서버 사이드 렌더링에서는 실행하지 않음
    if (typeof window === 'undefined') return;
    
    fetchInquiries(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);
  
  /**
   * 교육 키트 문의 데이터 가져오기
   * 
   * @param page - 현재 페이지 번호
   * @param pageSize - 페이지당 아이템 수
   */
  const fetchInquiries = async (page: number, pageSize: number) => {
    try {
      setIsInquiryLoading(true);
      const response = await getPaginatedInquiries(page, pageSize);
      
      // 전체 아이템 수 설정
      setTotalItems(response.count);
      
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

  /**
   * 새 문의 작성 다이얼로그 열기
   */
  const handleAddInquiry = () => {
    setInquiryDialogOpen(true);
  };

  /**
   * 페이지 변경 핸들러
   * 
   * @param page - 새 페이지 번호
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          교육 키트 구매 견적 문의
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          교육 키트 구매에 관한 모든 문의사항을 남겨주세요. 담당자가 최대한 빠르게 답변해드립니다.
        </Typography>
      </Paper>
      
      <Box sx={{ width: '100%' }}>
        <PaginatedBoardList
          title="교육 키트 구매 견적 문의 목록"
          items={isInquiryLoading ? [] : inquiryItems}
          onAddClick={handleAddInquiry}
          itemsPerPage={itemsPerPage}
          baseUrl="/inquiries"
        />
      </Box>
      
      {/* 교육 키트 문의 생성 다이얼로그 */}
      <InquiryDialog
        open={inquiryDialogOpen}
        onClose={() => setInquiryDialogOpen(false)}
        onSuccess={() => {
          // 문의 생성 후 목록 새로고침
          fetchInquiries(currentPage, itemsPerPage);
        }}
      />
    </Container>
  );
} 