from django.contrib import admin
from .models import OutreachInquiry, InternalClass

@admin.register(OutreachInquiry)
class OutreachInquiryAdmin(admin.ModelAdmin):
    """
    코딩 출강 교육 문의 Admin 설정
    """
    list_display = [
        'title',
        'requester_name', 
        'course_type',
        'student_count',
        'preferred_date',
        'duration',
        'budget',
        'status',
        'created_at'
    ]
    
    list_filter = [
        'status',
        'course_type',
        'student_grade',
        'duration',
        'created_at',
        'preferred_date'
    ]
    
    search_fields = [
        'title',
        'requester_name',
        'email',
        'phone',
        'location'
    ]
    
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('기본 정보', {
            'fields': (
                'title',
                'requester_name',
                'phone',
                'email'
            )
        }),
        ('교육 정보', {
            'fields': (
                'course_type',
                'student_count',
                'student_grade'
            )
        }),
        ('일정 정보', {
            'fields': (
                'preferred_date',
                'preferred_time',
                'duration',
                'duration_custom',
                'location'
            )
        }),
        ('예산 및 상세 정보', {
            'fields': (
                'budget',
                'message',
                'special_requests',
                'equipment'
            )
        }),
        ('상태 관리', {
            'fields': (
                'status',
                'admin_notes'
            )
        }),
        ('메타데이터', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ('collapse',)
        })
    )
    
    # 목록에서 편집 가능한 필드
    list_editable = ['status']
    
    # 페이지당 표시할 항목 수
    list_per_page = 20
    
    # 날짜별 드릴다운
    date_hierarchy = 'created_at'
    
    def get_course_type_display_korean(self, obj):
        """교육 과정을 한글로 표시"""
        return obj.get_course_type_display_korean()
    get_course_type_display_korean.short_description = '교육 과정'


@admin.register(InternalClass)
class InternalClassAdmin(admin.ModelAdmin):
    """
    내부 교육 수업 Admin 설정
    """
    list_display = [
        'title',
        'course_type',
        'class_type',
        'instructor',
        'target_grade',
        'get_enrollment_status',
        'start_date',
        'price',
        'get_discounted_price',
        'is_active'
    ]
    
    list_filter = [
        'course_type',
        'class_type',
        'target_grade',
        'is_active',
        'start_date',
        'instructor'
    ]
    
    search_fields = [
        'title',
        'instructor',
        'description'
    ]
    
    readonly_fields = [
        'created_at', 
        'updated_at',
        'get_enrollment_rate',
        'get_discounted_price',
        'is_full',
        'can_enroll'
    ]
    
    fieldsets = (
        ('기본 정보', {
            'fields': (
                'title',
                'course_type',
                'class_type',
                'instructor',
                'is_active'
            )
        }),
        ('수업 대상 및 정원', {
            'fields': (
                'target_grade',
                'max_students',
                'current_students',
                'get_enrollment_rate'
            )
        }),
        ('일정 정보', {
            'fields': (
                'start_date',
                'end_date',
                'class_time',
                'duration_hours',
                'sessions'
            )
        }),
        ('가격 정보', {
            'fields': (
                'price',
                'discount_rate',
                'get_discounted_price'
            )
        }),
        ('수업 상세', {
            'fields': (
                'description',
                'curriculum',
                'prerequisites',
                'materials'
            )
        }),
        ('이미지 및 미디어', {
            'fields': (
                'thumbnail',
                'images'
            )
        }),
        ('출강 정보', {
            'fields': (
                'location',
                'travel_fee'
            ),
            'description': '직접 출강인 경우에만 입력'
        }),
        ('시스템 정보', {
            'fields': (
                'is_full',
                'can_enroll',
                'created_at',
                'updated_at'
            ),
            'classes': ('collapse',)
        })
    )
    
    # 목록에서 편집 가능한 필드
    list_editable = ['is_active']
    
    # 페이지당 표시할 항목 수
    list_per_page = 15
    
    # 날짜별 드릴다운
    date_hierarchy = 'start_date'
    
    def get_enrollment_status(self, obj):
        """등록 현황 표시"""
        return f"{obj.current_students}/{obj.max_students} ({obj.get_enrollment_rate()}%)"
    get_enrollment_status.short_description = '등록 현황'
    
    def get_discounted_price(self, obj):
        """할인가 표시"""
        discounted = obj.get_discounted_price()
        if discounted != obj.price:
            return f"₩{discounted:,} (원가: ₩{obj.price:,})"
        return f"₩{obj.price:,}"
    get_discounted_price.short_description = '가격'
