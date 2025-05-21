from django.db import models
from .product import Product

class ProductImage(models.Model):
    """
    상품 이미지 정보를 저장하는 모델
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        help_text="연결된 상품"
    )
    image = models.ImageField(
        upload_to='products/',
        help_text="상품 이미지 파일"
    )
    is_thumbnail = models.BooleanField(
        default=False,
        help_text="대표 이미지 여부"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="이미지 등록일"
    )

    class Meta:
        verbose_name = '상품 이미지'
        verbose_name_plural = '상품 이미지 목록'

    def __str__(self):
        return f"{self.product.name}의 이미지" 