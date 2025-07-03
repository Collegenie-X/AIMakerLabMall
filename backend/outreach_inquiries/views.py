from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F
from .models import OutreachInquiry, InternalClass
from .permissions import IsOwnerOrReadOnly
from .serializers import (
    OutreachInquirySerializer,
    OutreachInquiryCreateSerializer,
    OutreachInquiryListSerializer,
    InternalClassSerializer,
    InternalClassListSerializer,
    ClassEnrollmentSerializer
)

class OutreachInquiryViewSet(viewsets.ModelViewSet):
    """
    코딩 출강 교육 문의 ViewSet
    - 목록 조회: 모든 사용자 가능 (로그인 불필요)
    - 상세 조회: 로그인한 사용자만 가능 
    - 생성: 모든 사용자 가능 (로그인 시 작성자 자동 설정)
    - 수정/삭제: 작성자만 가능
    """
    queryset = OutreachInquiry.objects.all()
    serializer_class = OutreachInquirySerializer
    permission_classes = [AllowAny]  # 기본적으로 모든 사용자 허용
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'requester_name', 'location']
    ordering_fields = ['created_at', 'preferred_date', 'student_count']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """
        액션에 따라 다른 권한 클래스 적용
        - list, create: 모든 사용자 허용
        - retrieve: 로그인한 사용자만 허용
        - update, partial_update, destroy: 작성자만 허용
        """
        if self.action == 'retrieve':
            # 상세 조회는 로그인 필요
            permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # 수정/삭제는 작성자만 가능
            permission_classes = [IsOwnerOrReadOnly]
        else:
            # 목록 조회, 생성은 모든 사용자 허용
            permission_classes = [AllowAny]
        
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """쿼리 파라미터를 사용한 필터링"""
        queryset = OutreachInquiry.objects.all()
        
        # 상태 필터
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        # 교육 과정 필터
        course_type = self.request.query_params.get('course_type', None)
        if course_type:
            queryset = queryset.filter(course_type=course_type)
            
        # 검색어 필터
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(requester_name__icontains=search) |
                Q(location__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    def get_serializer_class(self):
        """액션에 따라 다른 시리얼라이저 사용"""
        if self.action == 'create':
            return OutreachInquiryCreateSerializer
        elif self.action == 'list':
            return OutreachInquiryListSerializer
        return OutreachInquirySerializer
    
    def perform_create(self, serializer):
        """문의 생성 시 로그인한 사용자를 작성자로 설정"""
        # 로그인한 사용자인 경우 작성자로 설정
        if self.request.user and self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            # 비로그인 사용자는 user=None으로 저장
            serializer.save(user=None)
    
    def perform_update(self, serializer):
        """문의 수정 시 추가 처리"""
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def my_inquiries(self, request):
        """
        내 문의 목록 조회 (로그인 사용자만)
        GET /api/v1/outreach-inquiries/my_inquiries/
        """
        if not request.user or not request.user.is_authenticated:
            return Response(
                {'error': '로그인이 필요합니다.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        my_inquiries = self.queryset.filter(user=request.user)
        serializer = OutreachInquiryListSerializer(my_inquiries, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        문의 통계 정보 반환
        GET /api/v1/outreach-inquiries/statistics/
        """
        total_count = self.queryset.count()
        status_counts = {}
        course_type_counts = {}
        
        # 상태별 집계
        for status_choice in OutreachInquiry.STATUS_CHOICES:
            status_key = status_choice[0]
            count = self.queryset.filter(status=status_key).count()
            status_counts[status_key] = count
            
        # 교육 과정별 집계
        for course_choice in OutreachInquiry.COURSE_TYPE_CHOICES:
            course_key = course_choice[0]
            count = self.queryset.filter(course_type=course_key).count()
            course_type_counts[course_key] = count
            
        # 총 교육 대상자 수
        total_students = sum(
            inquiry.student_count for inquiry in self.queryset.all()
        )
        
        return Response({
            'total_inquiries': total_count,
            'total_students': total_students,
            'status_breakdown': status_counts,
            'course_type_breakdown': course_type_counts,
            'pending_count': status_counts.get('접수대기', 0),
            'in_progress_count': (
                status_counts.get('검토중', 0) + 
                status_counts.get('견적발송', 0) + 
                status_counts.get('확정', 0) +
                status_counts.get('진행중', 0)
            ),
            'completed_count': status_counts.get('완료', 0)
        })
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """
        최근 문의 목록 반환 (최대 5개)
        GET /api/v1/outreach-inquiries/recent/
        """
        recent_inquiries = self.queryset[:5]
        serializer = OutreachInquiryListSerializer(recent_inquiries, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        문의 상태만 업데이트 (관리자 전용)
        PATCH /api/v1/outreach-inquiries/{id}/update_status/
        """
        if not request.user or not request.user.is_staff:
            return Response(
                {'error': '관리자만 상태를 변경할 수 있습니다.'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        inquiry = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(OutreachInquiry.STATUS_CHOICES):
            return Response(
                {'error': '유효하지 않은 상태입니다.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        inquiry.status = new_status
        inquiry.save()
        
        serializer = self.get_serializer(inquiry)
        return Response(serializer.data)


class InternalClassViewSet(viewsets.ReadOnlyModelViewSet):
    """
    내부 교육 수업 ViewSet
    Read-Only 기능만 제공 (Admin에서 관리)
    """
    queryset = InternalClass.objects.filter(is_active=True)
    serializer_class = InternalClassSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]  # DjangoFilterBackend 제거
    # filterset_fields = ['course_type', 'class_type', 'target_grade', 'instructor']  # 주석 처리
    search_fields = ['title', 'instructor', 'description']
    ordering_fields = ['start_date', 'price', 'current_students']
    ordering = ['start_date']  # 기본 정렬: 시작일순
    permission_classes = [AllowAny]  # 모든 사용자 조회 허용
    
    def get_queryset(self):
        """쿼리 파라미터를 사용한 필터링"""
        queryset = InternalClass.objects.filter(is_active=True)
        
        # 교육 과정 필터
        course_type = self.request.query_params.get('course_type', None)
        if course_type:
            queryset = queryset.filter(course_type=course_type)
            
        # 수업 형태 필터  
        class_type = self.request.query_params.get('class_type', None)
        if class_type:
            queryset = queryset.filter(class_type=class_type)
            
        # 대상 학년 필터
        target_grade = self.request.query_params.get('target_grade', None)
        if target_grade:
            queryset = queryset.filter(target_grade=target_grade)
            
        # 강사 필터
        instructor = self.request.query_params.get('instructor', None)
        if instructor:
            queryset = queryset.filter(instructor__icontains=instructor)
        
        return queryset.order_by('start_date')
    
    def get_serializer_class(self):
        """액션에 따라 다른 시리얼라이저 사용"""
        if self.action == 'list':
            return InternalClassListSerializer
        return InternalClassSerializer
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """
        신청 가능한 수업만 반환
        GET /api/v1/internal-classes/available/
        """
        available_classes = self.queryset.filter(
            is_active=True,
            current_students__lt=F('max_students')
        )
        serializer = InternalClassListSerializer(available_classes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_course_type(self, request):
        """
        교육 과정별 수업 목록
        GET /api/v1/internal-classes/by_course_type/?course_type=python
        """
        course_type = request.query_params.get('course_type')
        if not course_type:
            return Response(
                {'error': 'course_type 파라미터가 필요합니다.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        classes = self.queryset.filter(course_type=course_type)
        serializer = InternalClassListSerializer(classes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        """
        수업 신청 (OutreachInquiry로 변환)
        POST /api/v1/internal-classes/{id}/enroll/
        """
        internal_class = self.get_object()
        
        # 신청 데이터에 class_id 추가
        enrollment_data = request.data.copy()
        enrollment_data['class_id'] = internal_class.id
        
        serializer = ClassEnrollmentSerializer(
            data=enrollment_data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            # 로그인한 사용자인 경우 작성자로 설정
            if request.user and request.user.is_authenticated:
                inquiry = serializer.save(user=request.user)
            else:
                inquiry = serializer.save(user=None)
            
            # 신청자 수 증가
            internal_class.current_students += 1
            internal_class.save()
            
            return Response({
                'message': '수업 신청이 완료되었습니다.',
                'inquiry_id': inquiry.id,
                'class_title': internal_class.title,
                'status': '접수대기'
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """
        인기 수업 목록 (신청률 기준)
        GET /api/v1/internal-classes/popular/
        """
        popular_classes = self.queryset.filter(
            current_students__gt=0
        ).order_by('-current_students')[:5]
        
        serializer = InternalClassListSerializer(popular_classes, many=True)
        return Response(serializer.data)
