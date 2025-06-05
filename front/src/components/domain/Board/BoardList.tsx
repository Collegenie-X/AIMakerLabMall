'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, Typography, List, ListItem, ListItemIcon, ListItemText, IconButton, Box } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ForumIcon from '@mui/icons-material/Forum';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SchoolIcon from '@mui/icons-material/School';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatDate } from '@/utils/dateUtils';

// 아이콘 매핑
const iconMap: Record<string, React.ReactNode> = {
  'key': <KeyIcon />,
  'forum': <ForumIcon />,
  'cart': <ShoppingCartIcon />,
  'school': <SchoolIcon />,
  'product': <ShoppingCartIcon color="primary" />,
  'price': <KeyIcon color="secondary" />,
  'delivery': <ForumIcon color="action" />,
  'etc': <SchoolIcon color="warning" />,
  'waiting': <HourglassEmptyIcon sx={{ color: '#9e9e9e' }} />,
  'reviewing': <SearchIcon sx={{ color: '#ff9800' }} />,
  'completed': <CheckCircleIcon sx={{ color: '#4caf50' }} />
};

// 문의 유형 한글 매핑
const inquiryTypeMap: Record<string, string> = {
  'product': '교구문의',
  'price': '가격문의',
  'delivery': '배송문의',
  'etc': '기타문의',
  'waiting': '접수대기',
  'reviewing': '검토중',
  'completed': '완료'
};

export interface BoardItem {
  id?: number;
  icon?: string;
  category?: string;
  inquiry_type?: string;
  title: string;
  date?: string;
  created_at?: string;
  author?: string;
  requester_name?: string;
}

interface BoardListProps {
  title: string;
  items: BoardItem[];
  onAddClick: () => void;
  maxItems?: number;
  baseUrl?: string;
}

/**
 * 게시글 목록 컴포넌트
 * Material-UI hydration 에러를 방지하기 위해 Typography 컴포넌트를 div로 렌더링
 */
export default function BoardList({ 
  title, 
  items, 
  onAddClick, 
  maxItems = 5,
  baseUrl = '/inquiries'
}: BoardListProps) {
  const router = useRouter();
  
  /**
   * 최대 표시 개수만큼만 아이템 제한
   */
  const displayItems = items.slice(0, maxItems);
  
  /**
   * 아이템 클릭 시 상세 페이지로 이동
   */
  const handleItemClick = (id?: number) => {
    if (id) {
      router.push(`${baseUrl}/${id}`);
    } else {
      // ID가 없는 경우 baseUrl로 이동
      router.push(baseUrl);
    }
  };

  return (
    <Card sx={{ width: '100%', boxShadow: 2 }}>
      <CardHeader 
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <IconButton 
              color="primary" 
              onClick={onAddClick}
              aria-label="글 작성하기"
            >
              <AddCircleIcon />
            </IconButton>
          </Box>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <List sx={{ p: 0 }}>
          {displayItems.length > 0 ? (
            displayItems.map((item, index) => (
              <ListItem 
                key={item.id || index}
                divider={index < displayItems.length - 1}
                sx={{ 
                  py: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => handleItemClick(item.id)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {iconMap[item.icon || item.inquiry_type || 'forum']}
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ component: 'div' }}
                  secondaryTypographyProps={{ component: 'div' }}
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          bgcolor: 'action.selected',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.category || inquiryTypeMap[item.inquiry_type || ''] || '문의'}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box display="flex" justifyContent="space-between" mt={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        {item.date || (item.created_at && formatDate(item.created_at)) || '날짜 없음'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.author || item.requester_name || '작성자 없음'}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primaryTypographyProps={{ component: 'div' }}
                primary={
                  <Typography variant="body2" color="text.secondary" align="center">
                    게시물이 없습니다
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
} 