from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from ..models import Product
from ..serializers.product_serializer import ProductListSerializer, ProductDetailSerializer

class ProductListView(generics.ListAPIView):
    """
    상품 목록 조회 API View
    - 로그인 없이 모든 사용자 접근 가능
    - 카테고리, 검색어, 정렬 기능 지원
    """
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]  # 로그인 없이 접근 허용

    def get_queryset(self):
        """
        쿼리셋 필터링 및 정렬 처리
        """
        queryset = Product.objects.all()
        
        # 카테고리 필터링
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # 검색어 필터링
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )
        
        # 정렬
        sort = self.request.query_params.get('sort', None)
        if sort:
            if sort == 'price_asc':
                queryset = queryset.order_by('price')
            elif sort == 'price_desc':
                queryset = queryset.order_by('-price')
            elif sort == 'latest':
                queryset = queryset.order_by('-created_at')
        
        return queryset

    def list(self, request, *args, **kwargs):
        """
        상품 목록 응답 데이터 구성
        """
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response({
            'status': 'success',
            'data': {
                'products': serializer.data,
                'meta': {
                    'total': queryset.count(),
                    'pages': 1,
                    'current_page': 1
                }
            }
        })

class ProductDetailView(generics.RetrieveAPIView):
    """
    상품 상세 조회 API View
    - 로그인 없이 모든 사용자 접근 가능
    """
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]  # 로그인 없이 접근 허용
    lookup_field = 'pk'

    def retrieve(self, request, *args, **kwargs):
        """
        상품 상세 정보 응답 데이터 구성
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={'request': request})
        return Response({
            'status': 'success',
            'data': serializer.data
        }) 