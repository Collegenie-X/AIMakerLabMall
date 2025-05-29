from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

# Create your models here.

class InquiryType(models.TextChoices):
    """교육 키트 문의 유형을 정의하는 열거형 클래스"""
    PRODUCT = 'product', '교구문의'
    PRICE = 'price', '가격문의'
    DELIVERY = 'delivery', '배송문의'
    ETC = 'etc', '기타문의'


def get_default_user():
    """기본 사용자를 반환하는 함수"""
    User = get_user_model()
    return User.objects.filter(is_superuser=True).first().id


class Inquiry(models.Model):
    """
    교육 키트 구매 견적 문의 모델
    
    사용자로부터 받은 교육 키트 구매 견적 문의 정보를 저장합니다.
    사용자와 1:N 관계를 가집니다.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='inquiries',
        verbose_name='작성자',
        null=True,  # 기존 데이터를 위해 null 허용
        default=None  # 명시적 기본값 없음
    )
    title = models.CharField(max_length=200, verbose_name='문의 제목')
    description = models.TextField(verbose_name='문의 내용')
    inquiry_type = models.CharField(
        max_length=20,
        choices=InquiryType.choices,
        default=InquiryType.PRODUCT,
        verbose_name='문의 종류'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성 일시')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정 일시')
    requester_name = models.CharField(max_length=100, verbose_name='요청자 이름')

    class Meta:
        verbose_name = '견적 문의'
        verbose_name_plural = '견적 문의 목록'
        ordering = ['-created_at']

    def __str__(self):
        """문의 객체의 문자열 표현을 반환합니다."""
        user_info = f"({self.user.email})" if self.user else "(이메일 없음)"
        return f"{self.title} - {self.requester_name} {user_info}"

    def is_owner(self, user):
        """
        현재 사용자가 문의의 작성자인지 확인하는 메서드
        
        Args:
            user: 확인할 사용자 객체
            
        Returns:
            bool: 작성자인 경우 True, 아닌 경우 False
        """
        if self.user is None:
            return False
        return self.user == user
