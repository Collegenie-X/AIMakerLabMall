from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from .category import Category
from .tag import Tag

class Product(models.Model):
    """
    상품 정보를 저장하는 모델
    """
    name = models.CharField(
        max_length=200,
        help_text="상품명 (예: 언플러그드 DIY 컴퓨터 만들기)"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name='카테고리'
    )
    tags = models.ManyToManyField(
        Tag,
        related_name='products',
        blank=True,
        verbose_name='태그'
    )
    description = models.TextField(
        help_text="상품 간단 설명"
    )
    product_detail_info = RichTextUploadingField(
        verbose_name='상세 설명',
        config_name='product_detail',
        help_text="관리자 페이지에서 HTML 에디터로 작성하는 상품 상세 설명",
        blank=True,
        null=True
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="상품 가격 (원 단위)"
    )
    duration = models.CharField(
        max_length=50,
        help_text="수업 시간 (예: 2~3시간)"
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('available', '판매 가능'),
            ('out_of_stock', '품절'),
            ('discontinued', '단종')
        ],
        default='available',
        help_text="상품 판매 상태"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="상품 등록일"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="상품 수정일"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = '상품'
        verbose_name_plural = '상품 목록'

    def __str__(self):
        return self.name 