import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Box, Typography, Button, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import { ArrowForwardIcon } from '@mui/icons-material';

/**
 * 게시판 목록 컴포넌트
 */
const BoardList: React.FC<BoardListProps> = ({
  title,
  items = [],
  baseUrl,
  onItemClick,
  maxHeight = '400px',
  showViewAll = true,
  iconMap = {},
  inquiryTypeMap = {}
}) => {
  const navigate = useNavigate();

  /**
   * 항목 클릭 처리
   */
  const handleItemClick = (item: BoardItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      navigate(`${baseUrl}/${item.id}`);
    }
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
   * 작성자 표시 (로그인 사용자면 "작성자", 아니면 요청자명)
   */
  const getAuthorDisplay = (item: BoardItem) => {
    // API 응답에 author_name이 있으면 사용, 없으면 requester_name 사용
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
        
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              등록된 항목이 없습니다
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight, overflow: 'auto' }}>
            <List disablePadding>
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    button
                    onClick={() => handleItemClick(item)}
                    sx={{
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
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
                  {index < items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BoardList; 