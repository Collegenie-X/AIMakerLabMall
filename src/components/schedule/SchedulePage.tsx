import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  DirectionsCar as DirectionsCarIcon,
  VideoLibrary as VideoLibraryIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Group as GroupIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';

/**
 * 수업 데이터 인터페이스
 */
interface ClassData {
  id: number;
  title: string;
  instructor: string;
  targetGrade: string;
  maxStudents: number;
  currentStudents: number;
  schedule: string;
  duration: number;
  sessions: number;
  price: number;
  discountRate: number;
  discountedPrice: number;
  enrollmentRate: number;
  classType: '오프라인' | '직접출강';
  courseType: string;
  description: string;
  thumbnail?: string;
  youtubeUrl?: string;
  location?: string;
  isEnrolled: boolean;
  isBookmarked: boolean;
}

/**
 * 수업 신청 다이얼로그 컴포넌트
 */
const EnrollmentDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  classData: ClassData;
  onSuccess: () => void;
}> = ({ open, onClose, classData, onSuccess }) => {
  const [formData, setFormData] = useState({
    requester_name: '',
    phone: '',
    email: '',
    student_count: 1,
    message: '',
    special_requests: ''
  });
  const [loading, setLoading] = useState(false);

  /**
   * 폼 데이터 변경 처리
   */
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * 수업 신청 처리
   */
  const handleEnrollment = async () => {
    if (!formData.requester_name || !formData.phone || !formData.email) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/internal-classes/${classData.id}/enroll/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '신청 처리 중 오류가 발생했습니다.');
      }

      const result = await response.json();
      alert(`${result.message}\n문의 번호: ${result.inquiry_id}`);
      onSuccess();
      onClose();
      
      // 신청 완료 후 문의 목록 페이지로 이동할지 물어보기
      const goToInquiries = window.confirm('신청이 완료되었습니다. 문의 목록을 확인하시겠습니까?');
      if (goToInquiries) {
        window.location.href = '/inquiries';
      }
      
    } catch (error) {
      console.error('수업 신청 오류:', error);
      alert(`신청 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle component="div">
        <Typography variant="h6" component="div">
          수업 신청
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {classData.title}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 수업 정보 요약 */}
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>신청하실 수업 정보</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                • 강사: {classData.instructor}
              </Typography>
              <Typography variant="body2">
                • 대상: {classData.targetGrade}
              </Typography>
              <Typography variant="body2">
                • 일정: {classData.schedule}
              </Typography>
              <Typography variant="body2">
                • 시간: {classData.duration}시간 (총 {classData.sessions}회차)
              </Typography>
              <Typography variant="body2">
                • 수강료: {classData.discountedPrice?.toLocaleString()}원
                {classData.discountRate > 0 && (
                  <span style={{ textDecoration: 'line-through', marginLeft: 8, color: '#666' }}>
                    {classData.price.toLocaleString()}원
                  </span>
                )}
              </Typography>
            </Box>
          </Paper>

          {/* 신청자 정보 */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>신청자 정보</Typography>
          
          <TextField
            label="이름"
            required
            fullWidth
            value={formData.requester_name}
            onChange={(e) => handleFormChange('requester_name', e.target.value)}
            placeholder="신청자 성함을 입력해주세요"
          />

          <TextField
            label="연락처"
            required
            fullWidth
            value={formData.phone}
            onChange={(e) => handleFormChange('phone', e.target.value)}
            placeholder="010-1234-5678"
          />

          <TextField
            label="이메일"
            required
            fullWidth
            type="email"
            value={formData.email}
            onChange={(e) => handleFormChange('email', e.target.value)}
            placeholder="example@email.com"
          />

          <TextField
            label="참여 인원"
            required
            fullWidth
            type="number"
            value={formData.student_count}
            onChange={(e) => handleFormChange('student_count', parseInt(e.target.value) || 1)}
            inputProps={{ min: 1, max: classData.maxStudents - classData.currentStudents }}
            helperText={`최대 ${classData.maxStudents - classData.currentStudents}명까지 신청 가능`}
          />

          <TextField
            label="문의 내용"
            fullWidth
            multiline
            rows={3}
            value={formData.message}
            onChange={(e) => handleFormChange('message', e.target.value)}
            placeholder="수업에 대한 문의사항이나 요청사항을 입력해주세요"
          />

          <TextField
            label="특별 요청사항"
            fullWidth
            multiline
            rows={2}
            value={formData.special_requests}
            onChange={(e) => handleFormChange('special_requests', e.target.value)}
            placeholder="알레르기, 특별한 도움이 필요한 사항 등이 있으면 입력해주세요"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          취소
        </Button>
        <Button 
          onClick={handleEnrollment} 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? '신청 중...' : '신청하기'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * 수업 카드 컴포넌트
 */
const ClassCard: React.FC<{
  classData: ClassData;
  onEnroll: (classData: ClassData) => void;
  onBookmarkToggle: (classId: number) => void;
}> = ({ classData, onEnroll, onBookmarkToggle }) => {
  
  /**
   * 수업 형태별 아이콘 반환
   */
  const getClassTypeIcon = () => {
    switch (classData.classType) {
      case '직접출강':
        return <DirectionsCarIcon color="primary" />;
      default:
        return <ScheduleIcon color="primary" />;
    }
  };

  /**
   * 수업 형태별 색상 반환
   */
  const getClassTypeColor = () => {
    switch (classData.classType) {
      case '직접출강':
        return '#ff9800';
      default:
        return '#2196f3';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: 3
        }
      }}
    >
      {/* 북마크 버튼 */}
      <IconButton
        sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          zIndex: 1,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.9)'
          }
        }}
        onClick={() => onBookmarkToggle(classData.id)}
      >
        {classData.isBookmarked ? 
          <BookmarkIcon color="warning" /> : 
          <BookmarkBorderIcon />
        }
      </IconButton>

      {/* 썸네일 */}
      {classData.thumbnail && (
        <Box 
          sx={{ 
            height: 200,
            backgroundImage: `url(${classData.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* 수업 형태 태그 */}
        <Box sx={{ mb: 1 }}>
          <Chip
            icon={getClassTypeIcon()}
            label={classData.classType}
            size="small"
            sx={{ 
              backgroundColor: getClassTypeColor(),
              color: 'white',
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
          />
        </Box>

        {/* 제목 */}
        <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
          {classData.title}
        </Typography>

        {/* 기본 정보 */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {classData.instructor}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <GroupIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {classData.targetGrade} • 정원 {classData.maxStudents}명
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {classData.schedule}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {classData.duration}시간 (총 {classData.sessions}회차)
            </Typography>
          </Box>
        </Box>

        {/* 진행률 */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              수강 신청률
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {classData.currentStudents}/{classData.maxStudents} ({classData.enrollmentRate}%)
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={classData.enrollmentRate} 
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        {/* 가격 정보 */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              ₩{classData.discountedPrice.toLocaleString()}
            </Typography>
            {classData.discountRate > 0 && (
              <>
                <Typography 
                  variant="body2" 
                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                >
                  ₩{classData.price.toLocaleString()}
                </Typography>
                <Chip
                  label={`${classData.discountRate}% 할인`}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              </>
            )}
          </Box>
        </Box>

        {/* 설명 */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {classData.description.length > 100 
            ? `${classData.description.substring(0, 100)}...` 
            : classData.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
          {classData.youtubeUrl && (
            <Tooltip title="미리보기 영상">
              <IconButton 
                color="primary"
                onClick={() => window.open(classData.youtubeUrl, '_blank')}
              >
                <VideoLibraryIcon />
              </IconButton>
            </Tooltip>
          )}
          
          <Button
            variant="contained"
            fullWidth
            disabled={classData.enrollmentRate >= 100}
            onClick={() => onEnroll(classData)}
            sx={{ ml: 'auto' }}
          >
            {classData.enrollmentRate >= 100 ? '정원 마감' : '수강 신청'}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

/**
 * 교육 일정 페이지 메인 컴포넌트
 */
const SchedulePage: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    courseType: '',
    classType: '',
    targetGrade: ''
  });
  const [enrollmentDialog, setEnrollmentDialog] = useState<{
    open: boolean;
    classData: ClassData | null;
  }>({
    open: false,
    classData: null
  });

  /**
   * 수업 목록 조회
   */
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/internal-classes/available/`);
      
      if (!response.ok) {
        throw new Error('수업 목록을 가져오는데 실패했습니다.');
      }
      
      const data = await response.json();
      
      // API 응답을 ClassData 형식에 맞게 변환
      const transformedData: ClassData[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        instructor: item.instructor,
        targetGrade: item.target_grade,
        maxStudents: item.max_students,
        currentStudents: item.current_students,
        schedule: item.formatted_schedule,
        duration: item.duration_hours,
        sessions: item.sessions || 1,
        price: item.price,
        discountRate: item.discount_rate,
        discountedPrice: item.discounted_price,
        enrollmentRate: item.enrollment_rate,
        classType: item.class_type,
        courseType: item.course_type,
        description: item.description || '',
        thumbnail: item.thumbnail,
        youtubeUrl: item.youtube_url,
        location: item.location,
        isEnrolled: false,
        isBookmarked: false
      }));
      
      setClasses(transformedData);
    } catch (error) {
      console.error('수업 목록 조회 오류:', error);
      alert('수업 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 컴포넌트 마운트 시 수업 목록 조회
   */
  useEffect(() => {
    fetchClasses();
  }, []);

  /**
   * 수강 신청 처리
   */
  const handleEnroll = (classData: ClassData) => {
    setEnrollmentDialog({
      open: true,
      classData
    });
  };

  /**
   * 수강 신청 성공 처리
   */
  const handleEnrollmentSuccess = () => {
    // 수업 목록 새로고침
    fetchClasses();
  };

  /**
   * 북마크 토글 처리
   */
  const handleBookmarkToggle = (classId: number) => {
    setClasses(prev => prev.map(cls => 
      cls.id === classId 
        ? { ...cls, isBookmarked: !cls.isBookmarked }
        : cls
    ));
  };

  /**
   * 필터 적용된 수업 목록
   */
  const filteredClasses = classes.filter(cls => {
    if (filter.courseType && cls.courseType !== filter.courseType) return false;
    if (filter.classType && cls.classType !== filter.classType) return false;
    if (filter.targetGrade && cls.targetGrade !== filter.targetGrade) return false;
    return true;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          교육 일정
        </Typography>
        <Typography variant="body1" color="text.secondary">
          다양한 코딩 교육 과정을 확인하고 수강 신청하세요
        </Typography>
      </Box>

      {/* 필터 */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>교육 과정</InputLabel>
          <Select
            value={filter.courseType}
            label="교육 과정"
            onChange={(e) => setFilter(prev => ({ ...prev, courseType: e.target.value }))}
          >
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="python">파이썬</MenuItem>
            <MenuItem value="arduino">아두이노</MenuItem>
            <MenuItem value="ai">AI 코딩</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>수업 형태</InputLabel>
          <Select
            value={filter.classType}
            label="수업 형태"
            onChange={(e) => setFilter(prev => ({ ...prev, classType: e.target.value }))}
          >
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="오프라인">오프라인</MenuItem>
            <MenuItem value="직접출강">직접 출강</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>대상</InputLabel>
          <Select
            value={filter.targetGrade}
            label="대상"
            onChange={(e) => setFilter(prev => ({ ...prev, targetGrade: e.target.value }))}
          >
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="초등 1-2학년">초등 1-2학년</MenuItem>
            <MenuItem value="초등 3-4학년">초등 3-4학년</MenuItem>
            <MenuItem value="초등 5-6학년">초등 5-6학년</MenuItem>
            <MenuItem value="중학생">중학생</MenuItem>
            <MenuItem value="고등학생">고등학생</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 수업 목록 */}
      <Grid container spacing={3}>
        {filteredClasses.map((classData) => (
          <Grid item xs={12} sm={6} md={4} key={classData.id}>
            <ClassCard
              classData={classData}
              onEnroll={handleEnroll}
              onBookmarkToggle={handleBookmarkToggle}
            />
          </Grid>
        ))}
      </Grid>

      {/* 수업 없음 메시지 */}
      {filteredClasses.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            조건에 맞는 수업이 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            다른 조건으로 검색해보세요
          </Typography>
        </Box>
      )}

      {/* 수강 신청 다이얼로그 */}
      {enrollmentDialog.classData && (
        <EnrollmentDialog
          open={enrollmentDialog.open}
          onClose={() => setEnrollmentDialog({ open: false, classData: null })}
          classData={enrollmentDialog.classData}
          onSuccess={handleEnrollmentSuccess}
        />
      )}
    </Container>
  );
};

export default SchedulePage; 