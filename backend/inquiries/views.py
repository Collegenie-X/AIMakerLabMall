from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q

from .models import Inquiry
from .serializers import InquirySerializer


class InquiryPagination(PageNumberPagination):
    """
    견적 문의 목록 페이지네이션 클래스
    
    페이지당 항목 수와 페이지 크기 매개변수를 설정합니다.
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
@permission_classes([AllowAny])
def get_inquiry_list(request):
    """
    견적 문의 목록을 조회하는 함수
    
    검색 기능과 페이지네이션을 지원합니다.
    검색어가 제공되면 제목이나 요청자 이름으로 필터링합니다.
    모든 사용자가 목록을 볼 수 있습니다.
    로그인하지 않은 사용자도 기본 목록은 볼 수 있지만, 상세 정보는 작성자만 볼 수 있습니다.
    """
    search_query = request.query_params.get('search', '')
    
    # 기본적으로 모든 문의 목록을 반환
    base_queryset = Inquiry.objects.all()
    
    # 검색어가 있을 경우 제목이나 요청자 이름으로 필터링
    if search_query:
        inquiries = base_queryset.filter(
            Q(title__icontains=search_query) | 
            Q(requester_name__icontains=search_query)
        )
    else:
        inquiries = base_queryset
    
    # 페이지네이션 적용
    paginator = InquiryPagination()
    paginated_inquiries = paginator.paginate_queryset(inquiries, request)
    
    serializer = InquirySerializer(paginated_inquiries, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_inquiry_detail(request, pk):
    """
    특정 견적 문의의 상세 정보를 조회하는 함수
    
    주어진 ID에 해당하는 견적 문의가 없으면 404 에러를 반환합니다.
    로그인한 사용자 중 작성자나 관리자만 조회할 수 있습니다.
    """
    try:
        inquiry = Inquiry.objects.get(pk=pk)
    except Inquiry.DoesNotExist:
        return Response(
            {"error": "견적 문의를 찾을 수 없습니다."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # 작성자나 관리자만 조회 가능
    if not (inquiry.is_owner(request.user) or request.user.is_staff):
        return Response(
            {"error": "이 문의를 조회할 권한이 없습니다."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = InquirySerializer(inquiry, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_inquiry(request):
    """
    새로운 견적 문의를 생성하는 함수
    
    요청 데이터가 유효하면 새 견적 문의를 생성하고, 
    그렇지 않으면 오류 메시지를 반환합니다.
    로그인한 사용자만 문의를 생성할 수 있습니다.
    """
    serializer = InquirySerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        # 현재 로그인한 사용자를 작성자로 설정
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_inquiry(request, pk):
    """
    기존 견적 문의를 수정하는 함수
    
    문의 작성자나 관리자만 수정할 수 있습니다.
    PUT 요청은 전체 업데이트, PATCH 요청은 부분 업데이트를 처리합니다.
    """
    try:
        inquiry = Inquiry.objects.get(pk=pk)
    except Inquiry.DoesNotExist:
        return Response(
            {"error": "견적 문의를 찾을 수 없습니다."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # 작성자나 관리자만 수정 가능
    if not (inquiry.is_owner(request.user) or request.user.is_staff):
        return Response(
            {"error": "이 문의를 수정할 권한이 없습니다."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'PUT':
        serializer = InquirySerializer(inquiry, data=request.data, context={'request': request})
    else:  # PATCH
        serializer = InquirySerializer(inquiry, data=request.data, partial=True, context={'request': request})
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_inquiry(request, pk):
    """
    견적 문의를 삭제하는 함수
    
    문의 작성자나 관리자만 삭제할 수 있습니다.
    삭제가 성공하면 성공 메시지를 반환합니다.
    """
    try:
        inquiry = Inquiry.objects.get(pk=pk)
    except Inquiry.DoesNotExist:
        return Response(
            {"error": "견적 문의를 찾을 수 없습니다."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # 작성자나 관리자만 삭제 가능
    if not (inquiry.is_owner(request.user) or request.user.is_staff):
        return Response(
            {"error": "이 문의를 삭제할 권한이 없습니다."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    inquiry.delete()
    return Response(
        {"message": "견적 문의가 성공적으로 삭제되었습니다."},
        status=status.HTTP_204_NO_CONTENT
    )
