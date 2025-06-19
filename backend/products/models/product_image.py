from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
import os
from products.models.product import Product

class ProductImage(models.Model):
    """
    상품 이미지 정보를 저장하는 모델
    - Product와 ForeignKey 관계
    - 대표 이미지 자동 지정 로직 포함
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        help_text="연결된 상품"
    )
    image = models.ImageField(
        upload_to='products/',
        help_text="상품 이미지 파일",
        blank=True,  # 이미지를 필수가 아니게 변경
        null=True    # null 값도 허용
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

    def clean(self):
        """
        모델 유효성 검사 수행
        - Product가 저장된 경우에만 대표 이미지 로직 적용
        - 신규 Product의 경우 안전한 처리
        """
        super().clean()
        
        # Product가 아직 저장되지 않은 경우 검증 건너뛰기
        if not self.product or not self.product.pk:
            return
            
        # 기존 Product에 대해서만 대표 이미지 로직 적용
        self._ensure_thumbnail_assignment()
    
    def _ensure_thumbnail_assignment(self):
        """
        대표 이미지 자동 지정 로직
        - 대표 이미지가 없는 경우 첫 번째 이미지를 대표로 지정
        """
        if (not self.is_thumbnail and 
            not self.product.images.filter(is_thumbnail=True).exists()):
            self.is_thumbnail = True

    @property
    def url(self):
        """
        이미지 URL을 반환하는 속성
        CKEditor에서 업로드한 이미지의 경우 media URL을 포함하여 반환
        
        Returns:
            str: 이미지 URL 또는 None
        """
        if self.image:
            if not self.image.url.startswith(settings.MEDIA_URL):
                return os.path.join(settings.MEDIA_URL, self.image.name)
            return self.image.url
        return None 