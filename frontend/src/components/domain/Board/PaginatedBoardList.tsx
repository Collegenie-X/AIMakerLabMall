'use client';

import React, { useState } from 'react';
import { Box, Pagination } from '@mui/material';
import BoardList, { BoardItem } from './BoardList';

/**
 * 페이지네이션이 포함된 게시판 컴포넌트
 * 
 * @param title - 게시판 제목
 * @param items - 게시판 아이템 목록 (전체 데이터)
 * @param onAddClick - 글 작성 버튼 클릭 핸들러
 * @param itemsPerPage - 페이지당 표시할 아이템 수
 * @param baseUrl - 게시물 상세 페이지 기본 URL
 * @param onItemClick - 커스텀 아이템 클릭 핸들러
 * @returns 페이지네이션이 적용된 게시판 컴포넌트
 */
export default function PaginatedBoardList({
  title,
  items,
  onAddClick,
  itemsPerPage = 5,
  baseUrl = '/inquiries',
  onItemClick
}: {
  title: string;
  items: BoardItem[];
  onAddClick: () => void;
  itemsPerPage?: number;
  baseUrl?: string;
  onItemClick?: (item: BoardItem) => void;
}) {
  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1);
  
  // 전체 페이지 수 계산
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  // 현재 페이지에 표시할 아이템 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);
  
  // 페이지 변경 핸들러
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <BoardList
        title={title}
        items={currentItems}
        onAddClick={onAddClick}
        maxItems={itemsPerPage}
        baseUrl={baseUrl}
        onItemClick={onItemClick}
      />
      
      {/* 페이지네이션 (아이템이 itemsPerPage보다 많을 때만 표시) */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination 
            count={totalPages} 
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="small"
          />
        </Box>
      )}
    </Box>
  );
} 