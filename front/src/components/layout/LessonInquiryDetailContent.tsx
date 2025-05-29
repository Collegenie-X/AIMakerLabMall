'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Divider, 
  Chip, 
  Grid, 
  Button, 
  CircularProgress, 
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import LockIcon from '@mui/icons-material/Lock';
import { getLessonInquiryById, LessonInquiry } from '@/services/lessonService';
import { formatDate } from '@/utils/dateUtils';

// 문의 유형 한글 매핑
const inquiryTypeMap: Record<string, string> = {
  'offline': '대면 수업',
  'online': '온라인 수업',
  'hybrid': '혼합형 수업',
  'etc': '기타 문의'
};

// 문의 유형별 색상 매핑
const inquiryColorMap: Record<string, string> = {
  'offline': 'primary',
  'online': 'secondary',
  'hybrid': 'info',
  'etc': 'default'
};

interface LessonInquiryDetailContentProps {
  inquiryId: number;
}

/**
 * 수업 문의 상세 컨텐츠 컴포넌트
 * 
 * @param inquiryId - 조회할 수업 문의 ID
 * @returns 수업 문의 상세 컨텐츠
 */
export default function LessonInquiryDetailContent({ inquiryId }: LessonInquiryDetailContentProps) {
  const router = useRouter();
  
  // 상태 관리
  const [inquiry, setInquiry] = useState<LessonInquiry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState<boolean>(false);
  
  // 문의 데이터 로드
  useEffect(() => {
    // 서버 사이드 렌더링에서는 실행하지 않음
    if (typeof window === 'undefined') return;
    
    const fetchLessonInquiryDetail = async () => {
      try {
        setLoading(true);
        const data = await getLessonInquiryById(inquiryId);
        setInquiry(data);
        setError(null);
        setIsForbidden(false);
      } catch (err: any) {
        console.error('수업 문의 상세 정보 로딩 오류:', err);
        
        // 403 Forbidden 에러 처리
        if (err.response && err.response.status === 403) {
          setIsForbidden(true);
          setError('권한이 없습니다. 이 문의에 접근할 수 있는 권한이 없습니다.');
        } else {
          setIsForbidden(false);
          setError('문의 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
        }
        
        setInquiry(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLessonInquiryDetail();
  }, [inquiryId]);
  
  // 목록으로 돌아가기
  const handleBackToList = () => {
    router.push('/lessons');
  };
  
  // 문의 유형 표시 텍스트
  const getInquiryTypeText = (type: string): string => {
    return inquiryTypeMap[type] || '기타 문의';
  };
  
  // 문의 유형 표시 색상
  const getInquiryTypeColor = (type: string): any => {
    return inquiryColorMap[type] || 'default';
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          수업 문의 정보를 불러오는 중입니다...
        </Typography>
      </Container>
    );
  }
  
  // 권한 없음 (403 Forbidden) 표시
  if (isForbidden) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mb: 3 }}>
          <LockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            접근 권한 없음
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            이 수업 문의에 접근할 수 있는 권한이 없습니다. 로그인이 필요하거나 권한이 제한된 문의일 수 있습니다.
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            variant="contained" 
            onClick={handleBackToList}
            sx={{ mt: 2 }}
          >
            목록으로
          </Button>
        </Paper>
      </Container>
    );
  }
  
  // 일반 오류 표시
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          variant="contained" 
          onClick={handleBackToList}
        >
          목록으로 돌아가기
        </Button>
      </Container>
    );
  }
  
  // 문의 정보가 없을 때
  if (!inquiry) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          요청하신 수업 문의 정보를 찾을 수 없습니다.
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          variant="contained" 
          onClick={handleBackToList}
        >
          목록으로 돌아가기
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 상단 네비게이션 및 제목 영역 */}
      <Box sx={{ mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          variant="outlined" 
          onClick={handleBackToList}
          sx={{ mb: 2 }}
        >
          목록으로
        </Button>
        
        <Paper elevation={1} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Chip 
                label={getInquiryTypeText(inquiry.inquiry_type)} 
                color={getInquiryTypeColor(inquiry.inquiry_type)}
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                {inquiry.title}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" />
                  <Typography variant="body2">
                    {inquiry.requester_name}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DateRangeIcon fontSize="small" />
                  <Typography variant="body2">
                    {formatDate(inquiry.created_at)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CategoryIcon fontSize="small" />
                  <Typography variant="body2">
                    코딩 출강 및 수업 문의
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      {/* 문의 내용 영역 */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          문의 내용
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
          <Typography variant="body1" component="div">
            {inquiry.description}
          </Typography>
        </Box>
        
        {/* 수업 문의 추가 정보 */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon fontSize="small" color="primary" />
                <Typography variant="body2" component="span" color="text.secondary">
                  교육 대상:
                </Typography>
                <Typography variant="body2" component="span">
                  {inquiry.target_audience}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon fontSize="small" color="primary" />
                <Typography variant="body2" component="span" color="text.secondary">
                  희망 일정:
                </Typography>
                <Typography variant="body2" component="span">
                  {inquiry.preferred_date}
                </Typography>
              </Box>
            </Grid>
            
            {inquiry.participant_count && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon fontSize="small" color="primary" />
                  <Typography variant="body2" component="span" color="text.secondary">
                    예상 참가 인원:
                  </Typography>
                  <Typography variant="body2" component="span">
                    {inquiry.participant_count}명
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
      
      {/* 답변 영역 - 답변이 있을 경우에만 표시 */}
      {inquiry.reply && (
        <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom>
            답변
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            <Typography variant="body1" component="div">
              {inquiry.reply}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="body2" color="text.secondary">
              답변일: {formatDate(inquiry.reply_created_at || new Date().toISOString())}
            </Typography>
          </Box>
        </Paper>
      )}
      
      {/* 하단 버튼 영역 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          variant="outlined" 
          onClick={handleBackToList}
        >
          목록으로
        </Button>
        
        <Box>
          {inquiry.is_owner && (
            <Button 
              variant="contained" 
              color="primary"
              sx={{ ml: 1 }}
              onClick={() => router.push(`/lessons/edit/${inquiryId}`)}
            >
              수정하기
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
} 