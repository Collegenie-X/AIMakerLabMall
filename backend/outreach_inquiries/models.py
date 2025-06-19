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
    
    # 작성자 정보 (선택사항 - 비로그인 사용자도 문의 가능)
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='outreach_inquiries',
        verbose_name="작성자",
        help_text="로그인한 사용자인 경우 자동 설정"
    )
    
    # 기본 정보
    title = models.CharField(
        max_length=200, 
        verbose_name="교육 제목", 
        default="교육 문의",
        help_text="예: 초등학생 대상 아두이노 기초 교육"
    )
    requester_name = models.CharField(
        max_length=50, 
        verbose_name="요청자 이름", 
        default="미입력",
        help_text="담당자 성함을 입력해주세요"
    )
    phone = models.CharField(
        max_length=20, 
        verbose_name="연락처", 
        default="000-0000-0000",
        help_text="예: 010-1234-5678"
    )
    email = models.EmailField(
        verbose_name="이메일", 
        default="example@email.com",
        help_text="연락 가능한 이메일 주소"
    )
    
    # 교육 정보
    course_type = models.CharField(
        max_length=30, 
        choices=COURSE_TYPE_CHOICES,
        verbose_name="교육 과정",
        default='python',
        help_text="원하시는 교육 과정을 선택해주세요"
    )
    student_count = models.PositiveIntegerField(
        verbose_name="참여 인원", 
        default=1,
        help_text="교육에 참여할 학생 수"
    )
    student_grade = models.CharField(
        max_length=20,
        choices=STUDENT_GRADE_CHOICES,
        verbose_name="학년/연령대",
        default='전체',
        help_text="교육 대상의 학년 또는 연령대"
    )
    
    # 일정 정보
    preferred_date = models.DateField(
        verbose_name="희망 날짜", 
        default=timezone.now,
        help_text="교육을 원하시는 날짜"
    )
    preferred_time = models.TimeField(
        verbose_name="희망 시간", 
        default="14:00",
        help_text="교육 시작 시간 (예: 14:00)"
    )
    duration = models.CharField(
        max_length=20,
        choices=DURATION_CHOICES,
        verbose_name="교육 시간",
        default='2시간',
        help_text="총 교육 시간을 선택해주세요"
    )
    duration_custom = models.CharField(
        max_length=50, 
        blank=True, null=True,
        verbose_name="기타 교육 시간",
        help_text="기타 선택 시 구체적인 시간을 입력 (예: 90분, 3시간 30분)"
    )
    location = models.CharField(
        max_length=200, 
        verbose_name="교육 장소", 
        default="미정",
        help_text="교육이 진행될 장소 (예: 서울시 강남구 OO초등학교)"
    )
    
    # 예산 정보
    budget = models.CharField(
        max_length=100, 
        blank=True, null=True, 
        verbose_name="예산",
        help_text="예상 예산 범위 (예: 50만원~100만원)"
    )
    
    # 상세 정보
    message = models.TextField(
        verbose_name="교육 요청사항", 
        default="교육 문의 내용을 입력해주세요.",
        help_text="교육 목적, 특별한 요청사항 등을 자세히 적어주세요"
    )
    special_requests = models.TextField(
        blank=True, null=True, 
        verbose_name="기타 요청사항",
        help_text="교육 환경, 준비물, 특별한 요구사항 등"
    )
    equipment = models.JSONField(
        default=list, blank=True,
        verbose_name="필요 장비",
        help_text="JSON 형태로 저장 (관리자용)"
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
        verbose_name="관리자 메모",
        help_text="내부 관리용 메모"
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
        
    def is_owner(self, user):
        """작성자인지 확인"""
        if not user or not user.is_authenticated:
            return False
        return self.user == user


# 내부 교육 수업 모델
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
    title = models.CharField(
        max_length=200, 
        verbose_name="수업 제목", 
        default="교육 수업",
        help_text="수업명을 입력하세요 (예: 아두이노 기초 및 개발환경 구축)"
    )
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
    instructor = models.CharField(
        max_length=50, 
        verbose_name="강사명", 
        default="담당 강사",
        help_text="수업을 진행할 강사님 성함"
    )
    target_grade = models.CharField(
        max_length=20,
        choices=STUDENT_GRADE_CHOICES,
        verbose_name="대상",
        default='전체'
    )
    max_students = models.PositiveIntegerField(
        verbose_name="최대 인원", 
        default=10,
        help_text="수강 정원"
    )
    current_students = models.PositiveIntegerField(default=0, verbose_name="현재 신청자")
    
    # 일정 정보
    start_date = models.DateField(
        verbose_name="시작일", 
        default=timezone.now,
        help_text="수업 시작 날짜"
    )
    end_date = models.DateField(
        verbose_name="종료일", 
        default=timezone.now,
        help_text="수업 종료 날짜"
    )
    class_time = models.TimeField(
        verbose_name="수업 시간", 
        default="14:00",
        help_text="수업 진행 시간"
    )
    duration_hours = models.PositiveIntegerField(
        verbose_name="총 교육 시간", 
        default=2,
        help_text="전체 교육 과정의 총 시간 (시간 단위)"
    )
    sessions = models.PositiveIntegerField(
        verbose_name="총 회차", 
        default=1,
        help_text="전체 교육 과정의 총 회차"
    )
    
    # 가격 정보
    price = models.PositiveIntegerField(
        verbose_name="가격", 
        default=50000,
        help_text="수업료 (원 단위)"
    )
    discount_rate = models.PositiveIntegerField(
        default=0, 
        verbose_name="할인율 (%)",
        help_text="할인율을 퍼센트로 입력 (예: 20)"
    )
    
    # 수업 상세 정보
    description = models.TextField(
        verbose_name="수업 설명", 
        default="수업 설명을 입력해주세요.",
        help_text="수업의 목표, 특징, 대상자에게 도움이 되는 점 등을 설명"
    )
    prerequisites = models.TextField(
        blank=True, null=True, 
        verbose_name="수강 조건",
        help_text="수강 전 필요한 사전 지식이나 조건 (예: 컴퓨터 기본 조작 가능)"
    )
    
    # 미디어 정보
    thumbnail = models.ImageField(
        upload_to='class_thumbnails/', 
        blank=True, null=True,
        verbose_name="썸네일 이미지",
        help_text="수업 대표 이미지 (권장 크기: 400x300px)"
    )
    youtube_url = models.URLField(
        blank=True, null=True,
        verbose_name="유튜브 URL",
        help_text="수업 미리보기 또는 소개 영상 URL (예: https://youtube.com/watch?v=xxxxx)"
    )
    images = models.JSONField(
        default=list, 
        verbose_name="수업 이미지",
        help_text="수업 진행 사진들의 URL 목록 (JSON 배열 형태)"
    )
    
    # 출강 관련 정보 (직접 출강인 경우)
    location = models.CharField(
        max_length=200, 
        blank=True, null=True,
        verbose_name="출강 장소",
        help_text="직접 출강인 경우 교육 장소"
    )
    travel_fee = models.PositiveIntegerField(
        default=0,
        verbose_name="출장비",
        help_text="직접 출강시 추가 출장비 (원 단위)"
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


# 커리큘럼 모델 (별도 테이블)
class Curriculum(models.Model):
    """
    교육 과정의 커리큘럼 모델
    """
    internal_class = models.ForeignKey(
        InternalClass,
        on_delete=models.CASCADE,
        related_name='curriculum_items',
        verbose_name="수업"
    )
    session_number = models.PositiveIntegerField(
        verbose_name="차시",
        help_text="몇 번째 차시인지 입력 (예: 1, 2, 3...)"
    )
    session_title = models.CharField(
        max_length=200,
        verbose_name="차시 제목",
        help_text="차시별 수업 제목 (예: 아두이노 기초 및 개발환경 구축)"
    )
    duration_minutes = models.PositiveIntegerField(
        verbose_name="소요 시간(분)",
        default=90,
        help_text="해당 차시의 소요 시간을 분 단위로 입력 (예: 90분)"
    )
    description = models.TextField(
        verbose_name="차시 설명",
        help_text="해당 차시에서 배우는 내용을 간단히 설명"
    )
    learning_objectives = models.JSONField(
        default=list,
        verbose_name="학습 목표",
        help_text="차시별 세부 학습 목표들을 배열로 입력 (예: ['아두이노 보드의 구조와 원리 이해', 'IDE 설치 및 설정'])"
    )
    materials_needed = models.TextField(
        blank=True, null=True,
        verbose_name="필요 준비물",
        help_text="해당 차시에 특별히 필요한 준비물이 있다면 입력"
    )
    
    class Meta:
        verbose_name = "커리큘럼"
        verbose_name_plural = "커리큘럼"
        ordering = ['internal_class', 'session_number']
        unique_together = ['internal_class', 'session_number']
        
    def __str__(self):
        return f"{self.internal_class.title} - {self.session_number}차시: {self.session_title}"
        
    def get_duration_display(self):
        """시간을 시간:분 형태로 표시"""
        hours = self.duration_minutes // 60
        minutes = self.duration_minutes % 60
        if hours > 0:
            return f"{hours}시간 {minutes}분" if minutes > 0 else f"{hours}시간"
        return f"{minutes}분"


# 준비 교구재 모델 (별도 테이블)
class ClassMaterial(models.Model):
    """
    수업별 준비 교구재 모델
    """
    internal_class = models.ForeignKey(
        InternalClass,
        on_delete=models.CASCADE,
        related_name='materials',
        verbose_name="수업"
    )
    name = models.CharField(
        max_length=100,
        verbose_name="교구재명",
        help_text="교구재 이름 (예: 아두이노 우노 보드, 브레드보드, LED)"
    )
    quantity = models.PositiveIntegerField(
        default=1,
        verbose_name="수량",
        help_text="학습자 1명당 필요한 수량"
    )
    unit = models.CharField(
        max_length=20,
        default="개",
        verbose_name="단위",
        help_text="수량의 단위 (예: 개, 세트, 장)"
    )
    is_required = models.BooleanField(
        default=True,
        verbose_name="필수 여부",
        help_text="반드시 필요한 교구재인지 여부"
    )
    description = models.TextField(
        blank=True, null=True,
        verbose_name="설명",
        help_text="교구재에 대한 상세 설명이나 사양"
    )
    price_estimate = models.PositiveIntegerField(
        blank=True, null=True,
        verbose_name="예상 가격",
        help_text="개당 예상 가격 (원 단위, 참고용)"
    )
    supplier_info = models.CharField(
        max_length=200,
        blank=True, null=True,
        verbose_name="구매처 정보",
        help_text="구매 가능한 업체나 쇼핑몰 정보"
    )
    
    class Meta:
        verbose_name = "수업 교구재"
        verbose_name_plural = "수업 교구재"
        ordering = ['internal_class', 'is_required', 'name']
        
    def __str__(self):
        required_text = "[필수]" if self.is_required else "[선택]"
        return f"{self.internal_class.title} - {required_text} {self.name} ({self.quantity}{self.unit})"
        
    def get_total_price_for_students(self, student_count):
        """전체 학생 수에 대한 총 예상 비용 계산"""
        if self.price_estimate:
            return self.price_estimate * self.quantity * student_count
        return None
