import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Pagination,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { BoardItem } from '../../types/board';

/**
 * PaginatedBoardList Props 인터페이스
 */
interface PaginatedBoardListProps {
  title: string;
  items: BoardItem[];
  loading?: boolean;
  baseUrl: string;
  onItemClick?: (item: BoardItem) => void;
  maxHeight?: string;
  showViewAll?: boolean;
  iconMap?: { [key: string]: React.ComponentType<any> };
  inquiryTypeMap?: { [key: string]: string };
  showOnlyOwnerDetails?: boolean; // 작성자만 상세보기 허용 여부
}

/**
 * 페이지네이션이 있는 게시판 목록 컴포넌트
 */
const PaginatedBoardList: React.FC<PaginatedBoardListProps> = ({
  title,
  items = [],
  loading = false,
  baseUrl,
  onItemClick,
  maxHeight = '400px',
  showViewAll = true,
  iconMap = {},
  inquiryTypeMap = {},
  showOnlyOwnerDetails = false
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [accessDeniedDialog, setAccessDeniedDialog] = useState(false);
  const itemsPerPage = 5;

  /**
   * 페이지네이션 계산
   */
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  /**
   * 항목 클릭 처리 (권한 검사 포함)
   */
  const handleItemClick = (item: BoardItem) => {
    // 작성자만 상세보기 제한이 활성화된 경우
    if (showOnlyOwnerDetails && !item.is_owner) {
      setAccessDeniedDialog(true);
      return;
    }

    if (onItemClick) {
      onItemClick(item);
    } else {
      navigate(`${baseUrl}/${item.id}`);
    }
  };

  /**
   * 페이지 변경 처리
   */
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  /**
   * 날짜 포맷팅
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const daysDiff = Math.floor(diff / (1000 * 3600 * 24));

    if (daysDiff === 0) {
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (daysDiff < 7) {
      return `${daysDiff}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  /**
   * 상태 아이콘 반환
   */
  const getStatusIcon = (status: string) => {
    const IconComponent = iconMap[status];
    if (IconComponent) {
      return <IconComponent sx={{ fontSize: 16, mr: 0.5 }} />;
    }
    return null;
  };

  /**
   * 문의 유형 한글명 반환
   */
  const getInquiryTypeDisplay = (type: string) => {
    return inquiryTypeMap[type] || type;
  };

  /**
   * 작성자 표시
   */
  const getAuthorDisplay = (item: BoardItem) => {
    if ('author_name' in item) {
      return item.author_name;
    }
    return item.requester_name || '익명';
  };

  /**
   * 권한 뱃지 표시
   */
  const getPermissionBadge = (item: BoardItem) => {
    if ('is_owner' in item && item.is_owner) {
      return (
        <Chip
          size="small"
          label="작성자"
          color="primary"
          variant="outlined"
          sx={{ ml: 1, fontSize: '0.7rem', height: '20px' }}
        />
      );
    }
    return null;
  };

  /**
   * 클릭 가능 여부 표시
   */
  const getClickableIndicator = (item: BoardItem) => {
    if (showOnlyOwnerDetails && !item.is_owner) {
      return (
        <Chip
          size="small"
          label="읽기전용"
          color="default"
          variant="outlined"
          sx={{ ml: 1, fontSize: '0.6rem', height: '18px' }}
        />
      );
    }
    return null;
  };

  /**
   * 아이템 마운트 시 페이지 리셋
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          {showViewAll && items.length > 0 && (
            <Button
              size="small"
              onClick={() => navigate(baseUrl)}
              endIcon={<ArrowForwardIcon />}
            >
              전체 목록 보기
            </Button>
          )}
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              등록된 항목이 없습니다
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ maxHeight, overflow: 'auto' }}>
              <List disablePadding>
                {currentItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      button={showOnlyOwnerDetails ? item.is_owner : true}
                      onClick={() => handleItemClick(item)}
                      sx={{
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: showOnlyOwnerDetails && !item.is_owner 
                            ? 'transparent' 
                            : 'action.hover'
                        },
                        cursor: showOnlyOwnerDetails && !item.is_owner 
                          ? 'default' 
                          : 'pointer',
                        opacity: showOnlyOwnerDetails && !item.is_owner ? 0.7 : 1
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            {getStatusIcon(item.status)}
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1
                              }}
                            >
                              {item.title}
                            </Typography>
                            {getPermissionBadge(item)}
                            {getClickableIndicator(item)}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {getAuthorDisplay(item)}
                              </Typography>
                              {item.course_type && (
                                <>
                                  <Typography variant="caption" color="text.secondary">•</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {getInquiryTypeDisplay(item.course_type)}
                                  </Typography>
                                </>
                              )}
                              {item.student_count && (
                                <>
                                  <Typography variant="caption" color="text.secondary">•</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {item.student_count}명
                                  </Typography>
                                </>
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(item.created_at)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < currentItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>

            {/* 페이지네이션 */}
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
          </>
        )}

        {/* 권한 없음 알림 */}
        {showOnlyOwnerDetails && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
              📝 본인이 작성한 문의만 상세보기가 가능합니다.
            </Alert>
          </Box>
        )}
      </CardContent>

      {/* 접근 거부 다이얼로그 */}
      <Dialog open={accessDeniedDialog} onClose={() => setAccessDeniedDialog(false)}>
        <DialogTitle>접근 제한</DialogTitle>
        <DialogContent>
          <Typography>
            본인이 작성한 문의만 상세보기가 가능합니다.
            <br />
            로그인 후 본인의 문의를 확인해주세요.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAccessDeniedDialog(false)}>
            확인
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setAccessDeniedDialog(false);
              navigate('/login');
            }}
          >
            로그인
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PaginatedBoardList; 