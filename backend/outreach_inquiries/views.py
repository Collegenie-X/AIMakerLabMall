from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import OutreachInquiry
from .serializers import (
    OutreachInquirySerializer,
    OutreachInquiryCreateSerializer,
    OutreachInquiryListSerializer
)

class OutreachInquiryViewSet(viewsets.ModelViewSet):
    """
    코딩 출강 교육 문의 ViewSet
    CRUD 기능을 모두 제공합니다.
    """
    queryset = OutreachInquiry.objects.all()
    serializer_class = OutreachInquirySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'course_type', 'student_grade']
    search_fields = ['title', 'organization_name', 'contact_person']
    ordering_fields = ['created_at', 'preferred_date', 'student_count']
    ordering = ['-created_at']  # 기본 정렬: 최신순
    
    def get_serializer_class(self):
        """액션에 따라 다른 시리얼라이저 사용"""
        if self.action == 'create':
            return OutreachInquiryCreateSerializer
        elif self.action == 'list':
            return OutreachInquiryListSerializer
        return OutreachInquirySerializer
    
    def get_permissions(self):
        """액션에 따라 다른 권한 설정"""
        if self.action in ['create', 'list', 'retrieve']:
            # 생성, 목록 조회, 상세 조회는 모든 사용자 허용
            permission_classes = [AllowAny]
        else:
            # 수정, 삭제는 인증된 사용자만 허용
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
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
                status_counts.get('확정', 0)
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
        문의 상태만 업데이트
        PATCH /api/v1/outreach-inquiries/{id}/update_status/
        """
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
    
    def perform_create(self, serializer):
        """문의 생성 시 추가 처리"""
        # 필요한 경우 여기에 이메일 알림 등의 로직 추가 가능
        serializer.save()
        
    def perform_update(self, serializer):
        """문의 수정 시 추가 처리"""
        serializer.save()
