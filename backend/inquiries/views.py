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
def get_inquiry_list(request):
    """
    견적 문의 목록을 조회하는 함수
    
    검색 기능과 페이지네이션을 지원합니다.
    검색어가 제공되면 제목이나 요청자 이름으로 필터링합니다.
    """
    search_query = request.query_params.get('search', '')
    
    # 검색어가 있을 경우 제목이나 요청자 이름으로 필터링
    if search_query:
        inquiries = Inquiry.objects.filter(
            Q(title__icontains=search_query) | 
            Q(requester_name__icontains=search_query)
        )
    else:
        inquiries = Inquiry.objects.all()
    
    # 페이지네이션 적용
    paginator = InquiryPagination()
    paginated_inquiries = paginator.paginate_queryset(inquiries, request)
    
    serializer = InquirySerializer(paginated_inquiries, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def get_inquiry_detail(request, pk):
    """
    특정 견적 문의의 상세 정보를 조회하는 함수
    
    주어진 ID에 해당하는 견적 문의가 없으면 404 에러를 반환합니다.
    """
    try:
        inquiry = Inquiry.objects.get(pk=pk)
    except Inquiry.DoesNotExist:
        return Response(
            {"error": "견적 문의를 찾을 수 없습니다."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = InquirySerializer(inquiry)
    return Response(serializer.data)


@api_view(['POST'])
def create_inquiry(request):
    """
    새로운 견적 문의를 생성하는 함수
    
    요청 데이터가 유효하면 새 견적 문의를 생성하고, 
    그렇지 않으면 오류 메시지를 반환합니다.
    """
    serializer = InquirySerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def update_inquiry(request, pk):
    """
    기존 견적 문의를 수정하는 함수
    
    관리자 권한이 필요합니다.
    PUT 요청은 전체 업데이트, PATCH 요청은 부분 업데이트를 처리합니다.
    """
    try:
        inquiry = Inquiry.objects.get(pk=pk)
    except Inquiry.DoesNotExist:
        return Response(
            {"error": "견적 문의를 찾을 수 없습니다."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'PUT':
        serializer = InquirySerializer(inquiry, data=request.data)
    else:  # PATCH
        serializer = InquirySerializer(inquiry, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_inquiry(request, pk):
    """
    견적 문의를 삭제하는 함수
    
    관리자 권한이 필요합니다.
    삭제가 성공하면 성공 메시지를 반환합니다.
    """
    try:
        inquiry = Inquiry.objects.get(pk=pk)
    except Inquiry.DoesNotExist:
        return Response(
            {"error": "견적 문의를 찾을 수 없습니다."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    inquiry.delete()
    return Response(
        {"message": "견적 문의가 성공적으로 삭제되었습니다."},
        status=status.HTTP_204_NO_CONTENT
    )
