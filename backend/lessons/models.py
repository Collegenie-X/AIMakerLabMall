from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

# Create your models here.

class LessonInquiryType(models.TextChoices):
    """코딩 출강 및 수업 문의 유형을 정의하는 열거형 클래스"""
    OFFLINE = 'offline', '대면 수업 문의'
    ONLINE = 'online', '온라인 수업 문의'
    WORKSHOP = 'workshop', '워크샵 문의'
    COACHING = 'coaching', '코칭/멘토링 문의'
    ETC = 'etc', '기타 문의'


def get_default_user():
    """기본 사용자를 반환하는 함수"""
    User = get_user_model()
    return User.objects.filter(is_superuser=True).first().id


class LessonInquiry(models.Model):
    """
    코딩 출강 및 수업 문의 모델
    
    사용자로부터 받은 코딩 수업 관련 문의 정보를 저장합니다.
    사용자와 1:N 관계를 가집니다.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lesson_inquiries',
        verbose_name='작성자',
        null=True,  # 기존 데이터를 위해 null 허용
        default=None  # 명시적 기본값 없음
    )
    title = models.CharField(max_length=200, verbose_name='문의 제목')
    description = models.TextField(verbose_name='문의 내용')
    inquiry_type = models.CharField(
        max_length=20,
        choices=LessonInquiryType.choices,
        default=LessonInquiryType.OFFLINE,
        verbose_name='문의 종류'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성 일시')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정 일시')
    requester_name = models.CharField(max_length=100, verbose_name='요청자 이름')
    
    # 추가 필드: 수업 관련 정보
    target_audience = models.CharField(max_length=100, verbose_name='교육 대상', blank=True)
    preferred_date = models.CharField(max_length=100, verbose_name='희망 일정', blank=True)
    participant_count = models.PositiveIntegerField(verbose_name='참가 인원수', null=True, blank=True)

    class Meta:
        verbose_name = '수업 문의'
        verbose_name_plural = '수업 문의 목록'
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
