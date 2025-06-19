import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Paper,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Message as MessageIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

/**
 * 문의 상세 데이터 인터페이스
 */
interface InquiryDetail {
  id: number;
  title: string;
  requester_name: string;
  author_name: string;
  phone: string;
  email: string;
  course_type: string;
  course_type_display: string;
  student_count: number;
  student_grade: string;
  preferred_date: string;
  preferred_time: string;
  formatted_datetime: string;
  duration: string;
  duration_display: string;
  location: string;
  budget: string;
  message: string;
  special_requests: string;
  status: string;
  created_at: string;
  updated_at: string;
  is_owner: boolean;
  can_edit: boolean;
  user?: number;
}

/**
 * 문의 상세 페이지 컴포넌트
 */
const InquiryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editData, setEditData] = useState<Partial<InquiryDetail>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  /**
   * 문의 상세 정보 조회
   */
  const fetchInquiryDetail = async () => {
    if (!id) {
      setError('잘못된 문의 ID입니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/outreach-inquiries/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error('문의 정보를 가져오는데 실패했습니다.');
      }

      const data = await response.json();
      setInquiry(data);
      setEditData({
        title: data.title,
        requester_name: data.requester_name,
        phone: data.phone,
        email: data.email,
        student_count: data.student_count,
        student_grade: data.student_grade,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        duration: data.duration,
        location: data.location,
        budget: data.budget,
        message: data.message,
        special_requests: data.special_requests
      });
    } catch (error) {
      console.error('문의 조회 오류:', error);
      setError('문의 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 문의 수정 처리
   */
  const handleEdit = async () => {
    if (!inquiry || !inquiry.can_edit) {
      setSnackbar({
        open: true,
        message: '수정 권한이 없습니다.',
        severity: 'error'
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/outreach-inquiries/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '수정에 실패했습니다.');
      }

      const updatedData = await response.json();
      setInquiry(updatedData);
      setEditDialog(false);
      setSnackbar({
        open: true,
        message: '문의가 성공적으로 수정되었습니다.',
        severity: 'success'
      });
    } catch (error) {
      console.error('문의 수정 오류:', error);
      setSnackbar({
        open: true,
        message: `수정 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * 문의 삭제 처리
   */
  const handleDelete = async () => {
    if (!inquiry || !inquiry.can_edit) {
      setSnackbar({
        open: true,
        message: '삭제 권한이 없습니다.',
        severity: 'error'
      });
      return;
    }

    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/outreach-inquiries/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '삭제에 실패했습니다.');
      }

      setSnackbar({
        open: true,
        message: '문의가 성공적으로 삭제되었습니다.',
        severity: 'success'
      });
      
      setTimeout(() => {
        navigate('/inquiries');
      }, 1500);
      
    } catch (error) {
      console.error('문의 삭제 오류:', error);
      setSnackbar({
        open: true,
        message: `삭제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        severity: 'error'
      });
    } finally {
      setDeleting(false);
      setDeleteDialog(false);
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
   * 컴포넌트 마운트 시 데이터 조회
   */
  useEffect(() => {
    fetchInquiryDetail();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !inquiry) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || '문의를 찾을 수 없습니다.'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/inquiries')}
        >
          목록으로 돌아가기
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/inquiries')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            문의 상세
          </Typography>
          <Chip
            label={inquiry.status}
            color={getStatusColor(inquiry.status)}
            size="small"
          />
        </Box>
        
        {/* 수정/삭제 버튼 (작성자만) */}
        {inquiry.can_edit && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditDialog(true)}
            >
              수정
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialog(true)}
            >
              삭제
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* 기본 정보 */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MessageIcon color="primary" />
                기본 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {inquiry.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  작성자: {inquiry.author_name} • 생성일: {new Date(inquiry.created_at).toLocaleDateString('ko-KR')}
                  {inquiry.updated_at !== inquiry.created_at && (
                    <span> • 수정일: {new Date(inquiry.updated_at).toLocaleDateString('ko-KR')}</span>
                  )}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">담당자</Typography>
                  </Box>
                  <Typography variant="body1">{inquiry.requester_name}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <SchoolIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">교육 과정</Typography>
                  </Box>
                  <Typography variant="body1">{inquiry.course_type_display}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>연락처</Typography>
                  <Typography variant="body1">{inquiry.phone}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>이메일</Typography>
                  <Typography variant="body1">{inquiry.email}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 교육 정보 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon color="primary" />
                교육 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>참여 인원</Typography>
                  <Typography variant="body1">{inquiry.student_count}명</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>대상</Typography>
                  <Typography variant="body1">{inquiry.student_grade}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">희망 일정</Typography>
                  </Box>
                  <Typography variant="body1">{inquiry.formatted_datetime}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>교육 시간</Typography>
                  <Typography variant="body1">{inquiry.duration_display}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">교육 장소</Typography>
                  </Box>
                  <Typography variant="body1">{inquiry.location}</Typography>
                </Grid>

                {inquiry.budget && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <MoneyIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">예산</Typography>
                    </Box>
                    <Typography variant="body1">{inquiry.budget}</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* 상세 내용 */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                문의 내용
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {inquiry.message}
                </Typography>
              </Paper>

              {inquiry.special_requests && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    특별 요청사항
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {inquiry.special_requests}
                    </Typography>
                  </Paper>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 사이드바 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AdminIcon color="primary" />
                처리 현황
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Chip
                  label={inquiry.status}
                  color={getStatusColor(inquiry.status)}
                  size="large"
                  sx={{ fontSize: '1rem', py: 2 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  문의 번호
                </Typography>
                <Typography variant="h6" color="primary">
                  #{inquiry.id.toString().padStart(4, '0')}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  접수일
                </Typography>
                <Typography variant="body1">
                  {new Date(inquiry.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>

              {inquiry.updated_at !== inquiry.created_at && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    최종 수정일
                  </Typography>
                  <Typography variant="body1">
                    {new Date(inquiry.updated_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
              )}

              {/* 권한 표시 */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  권한 정보
                </Typography>
                <Typography variant="body2">
                  {inquiry.is_owner ? '✅ 작성자 (수정/삭제 가능)' : '👀 읽기 전용'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 수정 다이얼로그 */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>문의 수정</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="제목"
              fullWidth
              value={editData.title || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <TextField
              label="담당자명"
              fullWidth
              value={editData.requester_name || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, requester_name: e.target.value }))}
            />

            <TextField
              label="연락처"
              fullWidth
              value={editData.phone || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
            />

            <TextField
              label="이메일"
              fullWidth
              type="email"
              value={editData.email || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
            />

            <TextField
              label="참여 인원"
              fullWidth
              type="number"
              value={editData.student_count || 1}
              onChange={(e) => setEditData(prev => ({ ...prev, student_count: parseInt(e.target.value) || 1 }))}
            />

            <TextField
              label="희망 날짜"
              fullWidth
              type="date"
              value={editData.preferred_date || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, preferred_date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="교육 장소"
              fullWidth
              value={editData.location || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
            />

            <TextField
              label="예산"
              fullWidth
              value={editData.budget || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, budget: e.target.value }))}
            />

            <TextField
              label="문의 내용"
              fullWidth
              multiline
              rows={4}
              value={editData.message || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, message: e.target.value }))}
            />

            <TextField
              label="특별 요청사항"
              fullWidth
              multiline
              rows={3}
              value={editData.special_requests || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, special_requests: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)} disabled={saving}>
            취소
          </Button>
          <Button
            onClick={handleEdit}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? '저장 중...' : '저장'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>문의 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            정말로 이 문의를 삭제하시겠습니까? 삭제된 문의는 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} disabled={deleting}>
            취소
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? '삭제 중...' : '삭제'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default InquiryDetailPage; 