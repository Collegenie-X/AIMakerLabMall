from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class OutreachInquiry(models.Model):
    """
    코딩 출강 및 수업 문의 모델
    """
    
    # 교육 과정 선택지
    COURSE_TYPE_CHOICES = [
        ('app-inventor', '앱 인벤터'),
        ('arduino', '아두이노'),
        ('raspberry-pi', 'Raspberry Pi'),
        ('ai', 'AI 코딩'),
        ('python', '파이썬 코딩'),
    ]
    
    # 상태 선택지
    STATUS_CHOICES = [
        ('접수대기', '접수대기'),
        ('검토중', '검토중'),
        ('견적발송', '견적발송'),
        ('확정', '확정'),
        ('완료', '완료'),
    ]
    
    # 학년/연령대 선택지
    STUDENT_GRADE_CHOICES = [
        ('초등 1-2학년', '초등 1-2학년'),
        ('초등 3-4학년', '초등 3-4학년'),
        ('초등 5-6학년', '초등 5-6학년'),
        ('중학생', '중학생'),
        ('고등학생', '고등학생'),
        ('성인', '성인'),
    ]
    
    # 기본 정보
    title = models.CharField(max_length=200, verbose_name="교육 제목")
    organization_name = models.CharField(max_length=100, verbose_name="기관/학교명")
    contact_person = models.CharField(max_length=50, verbose_name="담당자명")
    phone = models.CharField(max_length=20, verbose_name="연락처")
    email = models.EmailField(verbose_name="이메일")
    
    # 교육 정보
    course_type = models.CharField(
        max_length=20, 
        choices=COURSE_TYPE_CHOICES,
        verbose_name="희망 교육 과정"
    )
    student_count = models.PositiveIntegerField(verbose_name="참여 인원")
    student_grade = models.CharField(
        max_length=20,
        choices=STUDENT_GRADE_CHOICES,
        verbose_name="학년/연령대"
    )
    
    # 일정 정보
    preferred_date = models.DateField(verbose_name="희망 날짜")
    preferred_time = models.TimeField(verbose_name="희망 시간")
    duration = models.CharField(max_length=50, verbose_name="희망 수업 시간")
    location = models.CharField(max_length=200, verbose_name="교육 장소")
    
    # 상세 정보
    message = models.TextField(verbose_name="교육 요청사항")
    budget = models.CharField(max_length=50, blank=True, null=True, verbose_name="예산")
    special_requests = models.TextField(
        blank=True, null=True, 
        verbose_name="기타 요청사항"
    )
    equipment = models.JSONField(
        default=list, blank=True,
        verbose_name="필요 장비"
    )
    
    # 상태 및 메타데이터
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='접수대기',
        verbose_name="상태"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="생성일시")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="수정일시")
    
    # 관리자 메모 (선택사항)
    admin_notes = models.TextField(
        blank=True, null=True,
        verbose_name="관리자 메모"
    )
    
    class Meta:
        verbose_name = "코딩 출강 교육 문의"
        verbose_name_plural = "코딩 출강 교육 문의들"
        ordering = ['-created_at']  # 최신순 정렬
        
    def __str__(self):
        return f"{self.title} - {self.organization_name}"
        
    def get_course_type_display_korean(self):
        """교육 과정명을 한글로 반환"""
        course_dict = dict(self.COURSE_TYPE_CHOICES)
        return course_dict.get(self.course_type, self.course_type)
        
    def get_formatted_date(self):
        """날짜를 한국 형식으로 포맷팅"""
        return self.preferred_date.strftime('%Y.%m.%d')
        
    def get_formatted_time(self):
        """시간을 24시간 형식으로 포맷팅"""
        return self.preferred_time.strftime('%H:%M')
