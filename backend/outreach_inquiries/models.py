from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

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
        ('scratch', '스크래치'),
        ('web-development', '웹 개발'),
        ('game-development', '게임 개발'),
        ('data-science', '데이터 사이언스'),
        ('robotics', '로보틱스'),
    ]
    
    # 상태 선택지
    STATUS_CHOICES = [
        ('접수대기', '접수대기'),
        ('검토중', '검토중'),
        ('견적발송', '견적발송'),
        ('확정', '확정'),
        ('진행중', '진행중'),
        ('완료', '완료'),
        ('취소', '취소'),
    ]
    
    # 학년/연령대 선택지
    STUDENT_GRADE_CHOICES = [
        ('초등 1-2학년', '초등 1-2학년'),
        ('초등 3-4학년', '초등 3-4학년'),
        ('초등 5-6학년', '초등 5-6학년'),
        ('중학생', '중학생'),
        ('고등학생', '고등학생'),
        ('성인', '성인'),
        ('전체', '전체'),
    ]
    
    # 수업 시간 선택지
    DURATION_CHOICES = [
        ('1시간', '1시간'),
        ('2시간', '2시간'),
        ('3시간', '3시간'),
        ('4시간', '4시간'),
        ('6시간', '6시간'),
        ('8시간', '8시간'),
        ('12시간', '12시간'),
        ('16시간', '16시간'),
        ('20시간', '20시간'),
        ('24시간', '24시간'),
        ('30시간', '30시간'),
        ('40시간', '40시간'),
        ('기타', '기타'),
    ]
    
    # 기본 정보
    title = models.CharField(max_length=200, verbose_name="교육 제목", default="교육 문의")
    requester_name = models.CharField(max_length=50, verbose_name="요청자 이름", default="미입력")
    phone = models.CharField(max_length=20, verbose_name="연락처", default="000-0000-0000")
    email = models.EmailField(verbose_name="이메일", default="example@email.com")
    
    # 교육 정보
    course_type = models.CharField(
        max_length=30, 
        choices=COURSE_TYPE_CHOICES,
        verbose_name="교육 과정",
        default='python'
    )
    student_count = models.PositiveIntegerField(verbose_name="참여 인원", default=1)
    student_grade = models.CharField(
        max_length=20,
        choices=STUDENT_GRADE_CHOICES,
        verbose_name="학년/연령대",
        default='전체'
    )
    
    # 일정 정보
    preferred_date = models.DateField(verbose_name="희망 날짜", default=timezone.now)
    preferred_time = models.TimeField(verbose_name="희망 시간", default="14:00")
    duration = models.CharField(
        max_length=20,
        choices=DURATION_CHOICES,
        verbose_name="교육 시간",
        default='2시간'
    )
    duration_custom = models.CharField(
        max_length=50, 
        blank=True, null=True,
        verbose_name="기타 교육 시간"
    )
    location = models.CharField(max_length=200, verbose_name="교육 장소", default="미정")
    
    # 예산 정보
    budget = models.CharField(max_length=100, blank=True, null=True, verbose_name="예산")
    
    # 상세 정보
    message = models.TextField(verbose_name="교육 요청사항", default="교육 문의 내용을 입력해주세요.")
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
        return f"{self.title} - {self.requester_name}"
        
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
        
    def get_formatted_datetime(self):
        """날짜와 시간을 함께 표시"""
        return f"{self.get_formatted_date()} {self.get_formatted_time()}"
        
    def get_duration_display(self):
        """교육 시간 표시 (기타인 경우 커스텀 값 사용)"""
        if self.duration == '기타' and self.duration_custom:
            return self.duration_custom
        return self.duration


# 내부 교육 수업 모델 추가
class InternalClass(models.Model):
    """
    내부 교육 수업 모델 (정규 수업)
    """
    
    # 교육 과정 선택지 (OutreachInquiry와 동일)
    COURSE_TYPE_CHOICES = OutreachInquiry.COURSE_TYPE_CHOICES
    
    # 수업 형태 선택지
    CLASS_TYPE_CHOICES = [
        ('오프라인', '오프라인 수업'),
        ('직접출강', '직접 출강'),
    ]
    
    # 상태 선택지
    STATUS_CHOICES = [
        ('미신청', '미신청'),
        ('신청완료', '신청완료'),
        ('수강중', '수강중'),
        ('수료', '수료'),
        ('취소', '취소'),
    ]
    
    # 학년/연령대 선택지
    STUDENT_GRADE_CHOICES = OutreachInquiry.STUDENT_GRADE_CHOICES
    
    # 기본 정보
    title = models.CharField(max_length=200, verbose_name="수업 제목", default="교육 수업")
    course_type = models.CharField(
        max_length=30,
        choices=COURSE_TYPE_CHOICES,
        verbose_name="교육 과정",
        default='python'
    )
    class_type = models.CharField(
        max_length=20,
        choices=CLASS_TYPE_CHOICES,
        default='오프라인',
        verbose_name="수업 형태"
    )
    
    # 수업 정보
    instructor = models.CharField(max_length=50, verbose_name="강사명", default="담당 강사")
    target_grade = models.CharField(
        max_length=20,
        choices=STUDENT_GRADE_CHOICES,
        verbose_name="대상",
        default='전체'
    )
    max_students = models.PositiveIntegerField(verbose_name="최대 인원", default=10)
    current_students = models.PositiveIntegerField(default=0, verbose_name="현재 신청자")
    
    # 일정 정보
    start_date = models.DateField(verbose_name="시작일", default=timezone.now)
    end_date = models.DateField(verbose_name="종료일", default=timezone.now)
    class_time = models.TimeField(verbose_name="수업 시간", default="14:00")
    duration_hours = models.PositiveIntegerField(verbose_name="총 교육 시간", default=2)
    sessions = models.PositiveIntegerField(verbose_name="총 회차", default=1)
    
    # 가격 정보
    price = models.PositiveIntegerField(verbose_name="가격", default=50000)
    discount_rate = models.PositiveIntegerField(default=0, verbose_name="할인율 (%)")
    
    # 수업 상세 정보
    description = models.TextField(verbose_name="수업 설명", default="수업 설명을 입력해주세요.")
    curriculum = models.JSONField(default=list, verbose_name="커리큘럼")
    prerequisites = models.TextField(blank=True, null=True, verbose_name="수강 조건")
    materials = models.TextField(blank=True, null=True, verbose_name="준비물")
    
    # 썸네일 및 이미지
    thumbnail = models.ImageField(
        upload_to='class_thumbnails/', 
        blank=True, null=True,
        verbose_name="썸네일 이미지"
    )
    images = models.JSONField(default=list, verbose_name="수업 이미지")
    
    # 출강 관련 정보 (직접 출강인 경우)
    location = models.CharField(
        max_length=200, 
        blank=True, null=True,
        verbose_name="출강 장소"
    )
    travel_fee = models.PositiveIntegerField(
        default=0,
        verbose_name="출장비"
    )
    
    # 메타데이터
    is_active = models.BooleanField(default=True, verbose_name="활성화")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="생성일시")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="수정일시")
    
    class Meta:
        verbose_name = "내부 교육 수업"
        verbose_name_plural = "내부 교육 수업들"
        ordering = ['start_date']
        
    def __str__(self):
        return f"{self.title} ({self.get_class_type_display()})"
        
    def get_discounted_price(self):
        """할인된 가격 계산"""
        if self.discount_rate > 0:
            return int(self.price * (100 - self.discount_rate) / 100)
        return self.price
        
    def get_enrollment_rate(self):
        """수강 신청률 계산"""
        if self.max_students > 0:
            return int((self.current_students / self.max_students) * 100)
        return 0
        
    def is_full(self):
        """정원 마감 여부"""
        return self.current_students >= self.max_students
        
    def can_enroll(self):
        """신청 가능 여부"""
        return self.is_active and not self.is_full()
        
    def get_formatted_schedule(self):
        """일정 포맷팅"""
        return f"{self.start_date.strftime('%Y.%m.%d')} - {self.end_date.strftime('%Y.%m.%d')}"
