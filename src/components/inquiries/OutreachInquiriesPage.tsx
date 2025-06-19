import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Pagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { BoardItem } from '../../types/board';
import { API_CONFIG, apiHelpers } from '../../config/api';

/**
 * 현재 사용자 정보 가져오기
 */
const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * 코딩 출강 교육 문의 목록 페이지
 */
const OutreachInquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    course_type: '',
    search: ''
  });
  const [accessDeniedDialog, setAccessDeniedDialog] = useState(false);
  const itemsPerPage = 10;

  /**
   * 문의 목록 조회
   */
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      
      // 검색 파라미터 구성
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.course_type) params.append('course_type', filters.course_type);
      if (filters.search) params.append('search', filters.search);
      
      const url = apiHelpers.getFullUrl(
        `${API_CONFIG.ENDPOINTS.OUTREACH_INQUIRIES}/?${params.toString()}`
      );
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
          // 임시로 토큰 인증 제거
        }
      });

      if (!response.ok) {
        throw new Error('문의 목록을 가져오는데 실패했습니다.');
      }

      const data = await response.json();
      const currentUser = getCurrentUser();
      
      // API 응답을 BoardItem 형식으로 변환하고 is_owner 계산
      const transformedData: BoardItem[] = data.map((item: any) => {
        // author_name을 기준으로 is_owner 판단
        let isOwner = false;
        if (currentUser) {
          // author_name이 현재 사용자의 username과 일치하면 소유자
          isOwner = item.author_name === currentUser.username;
        }

        return {
          id: item.id,
          title: item.title,
          requester_name: item.requester_name,
          author_name: item.author_name,
          course_type: item.course_type,
          student_count: item.student_count,
          status: item.status,
          created_at: item.created_at,
          is_owner: isOwner,
          can_edit: isOwner || (currentUser && currentUser.is_staff)
        };
      });

      setInquiries(transformedData);
    } catch (error) {
      console.error('문의 목록 조회 오류:', error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 컴포넌트 마운트 시 및 필터 변경 시 데이터 조회
   */
  useEffect(() => {
    fetchInquiries();
  }, [filters]);

  /**
   * 필터 변경 처리
   */
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  /**
   * 페이지네이션 계산
   */
  const totalPages = Math.ceil(inquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInquiries = inquiries.slice(startIndex, endIndex);

  /**
   * 항목 클릭 처리 (권한 검사 포함)
   */
  const handleItemClick = (item: BoardItem) => {
    // 작성자가 아닌 경우 접근 제한
    if (!item.is_owner) {
      setAccessDeniedDialog(true);
      return;
    }
    
    navigate(`/inquiries/${item.id}`);
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
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * 상태 아이콘 반환
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case '접수대기': return <HourglassEmptyIcon sx={{ fontSize: 16, mr: 0.5 }} />;
      case '검토중': return <SearchIcon sx={{ fontSize: 16, mr: 0.5 }} />;
      case '완료': return <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />;
      case '취소': return <CancelIcon sx={{ fontSize: 16, mr: 0.5 }} />;
      default: return <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />;
    }
  };

  /**
   * 상태 색상 반환
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case '접수대기': return 'warning';
      case '검토중': return 'info';
      case '견적발송': return 'primary';
      case '확정': return 'success';
      case '진행중': return 'secondary';
      case '완료': return 'success';
      case '취소': return 'error';
      default: return 'default';
    }
  };

  /**
   * 교육 과정 한글명 반환
   */
  const getCourseTypeDisplay = (type: string) => {
    const courseTypeMap: { [key: string]: string } = {
      'app-inventor': '앱 인벤터',
      'arduino': '아두이노',
      'raspberry-pi': 'Raspberry Pi',
      'ai': 'AI 코딩',
      'python': '파이썬 코딩',
      'scratch': '스크래치',
      'web-development': '웹 개발',
      'game-development': '게임 개발',
      'data-science': '데이터 사이언스',
      'robotics': '로보틱스'
    };
    return courseTypeMap[type] || type;
  };

  /**
   * 작성자 표시
   */
  const getAuthorDisplay = (item: BoardItem) => {
    return item.author_name || item.requester_name || '익명';
  };

  /**
   * 권한 뱃지 표시
   */
  const getPermissionBadge = (item: BoardItem) => {
    if (item.is_owner) {
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
    return (
      <Chip
        size="small"
        label="읽기전용"
        color="default"
        variant="outlined"
        sx={{ ml: 1, fontSize: '0.6rem', height: '18px' }}
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            코딩 출강 교육 문의
          </Typography>
          <Typography variant="body1" color="text.secondary">
            학교, 기관, 단체를 대상으로 전문 강사가 직접 찾아가는 맞춤형 코딩 교육 서비스입니다.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/inquiries/new')}
          sx={{ height: 'fit-content' }}
        >
          새 문의 작성
        </Button>
      </Box>

      {/* 필터 및 검색 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>상태</InputLabel>
                <Select
                  value={filters.status}
                  label="상태"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">전체</MenuItem>
                  <MenuItem value="접수대기">접수대기</MenuItem>
                  <MenuItem value="검토중">검토중</MenuItem>
                  <MenuItem value="견적발송">견적발송</MenuItem>
                  <MenuItem value="확정">확정</MenuItem>
                  <MenuItem value="진행중">진행중</MenuItem>
                  <MenuItem value="완료">완료</MenuItem>
                  <MenuItem value="취소">취소</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>교육 과정</InputLabel>
                <Select
                  value={filters.course_type}
                  label="교육 과정"
                  onChange={(e) => handleFilterChange('course_type', e.target.value)}
                >
                  <MenuItem value="">전체</MenuItem>
                  <MenuItem value="python">파이썬 코딩</MenuItem>
                  <MenuItem value="arduino">아두이노</MenuItem>
                  <MenuItem value="ai">AI 코딩</MenuItem>
                  <MenuItem value="scratch">스크래치</MenuItem>
                  <MenuItem value="app-inventor">앱 인벤터</MenuItem>
                  <MenuItem value="web-development">웹 개발</MenuItem>
                  <MenuItem value="game-development">게임 개발</MenuItem>
                  <MenuItem value="robotics">로보틱스</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="검색"
                placeholder="제목, 요청자명, 장소로 검색"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 문의 목록 */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              문의 목록 ({inquiries.length}건)
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : inquiries.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                문의가 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                첫 번째 교육 문의를 작성해보세요
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/inquiries/new')}
              >
                문의 작성하기
              </Button>
            </Box>
          ) : (
            <>
              <List disablePadding>
                {currentInquiries.map((inquiry, index) => (
                  <React.Fragment key={inquiry.id}>
                    <ListItem
                      button={inquiry.is_owner}
                      onClick={() => handleItemClick(inquiry)}
                      sx={{
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: inquiry.is_owner ? 'action.hover' : 'transparent'
                        },
                        cursor: inquiry.is_owner ? 'pointer' : 'default',
                        opacity: inquiry.is_owner ? 1 : 0.7
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            {getStatusIcon(inquiry.status)}
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 500,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1
                              }}
                            >
                              {inquiry.title}
                            </Typography>
                            <Chip
                              label={inquiry.status}
                              color={getStatusColor(inquiry.status)}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                            {getPermissionBadge(inquiry)}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {getAuthorDisplay(inquiry)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">•</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {getCourseTypeDisplay(inquiry.course_type || '')}
                              </Typography>
                              {inquiry.student_count && (
                                <>
                                  <Typography variant="body2" color="text.secondary">•</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {inquiry.student_count}명
                                  </Typography>
                                </>
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(inquiry.created_at)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < currentInquiries.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}

          {/* 권한 안내 */}
          <Box sx={{ mt: 3 }}>
            <Alert severity="info">
              📝 본인이 작성한 문의만 상세보기가 가능합니다. 로그인 후 본인의 문의를 확인해주세요.
            </Alert>
          </Box>
        </CardContent>
      </Card>

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
    </Container>
  );
};

export default OutreachInquiriesPage; 