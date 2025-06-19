from django.contrib import admin
from .models import OutreachInquiry, InternalClass, Curriculum, ClassMaterial

@admin.register(OutreachInquiry)
class OutreachInquiryAdmin(admin.ModelAdmin):
    """
    코딩 출강 교육 문의 Admin 설정
    """
    list_display = [
        'title',
        'requester_name',
        'get_author_display', 
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
        'preferred_date',
        'user'  # 작성자별 필터 추가
    ]
    
    search_fields = [
        'title',
        'requester_name',
        'email',
        'phone',
        'location',
        'user__username',  # 작성자 username으로도 검색 가능
        'user__email'      # 작성자 email로도 검색 가능
    ]
    
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('작성자 정보', {
            'fields': (
                'user',
            ),
            'description': '로그인한 사용자인 경우 자동 설정됩니다.'
        }),
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
    
    def get_author_display(self, obj):
        """작성자 정보 표시"""
        if obj.user:
            return f"{obj.user.username} (로그인)"
        return f"{obj.requester_name} (비로그인)"
    get_author_display.short_description = '작성자'
    get_author_display.admin_order_field = 'user'
    
    def get_course_type_display_korean(self, obj):
        """교육 과정을 한글로 표시"""
        return obj.get_course_type_display_korean()
    get_course_type_display_korean.short_description = '교육 과정'


# 커리큘럼 인라인 Admin
class CurriculumInline(admin.TabularInline):
    """
    InternalClass에서 커리큘럼을 인라인으로 관리
    """
    model = Curriculum
    extra = 1
    ordering = ['session_number']
    fields = ['session_number', 'session_title', 'duration_minutes', 'description']


# 교구재 인라인 Admin  
class ClassMaterialInline(admin.TabularInline):
    """
    InternalClass에서 교구재를 인라인으로 관리
    """
    model = ClassMaterial
    extra = 1
    ordering = ['is_required', 'name']
    fields = ['name', 'quantity', 'unit', 'is_required', 'price_estimate']


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
    
    # 인라인으로 커리큘럼과 교구재 관리
    inlines = [CurriculumInline, ClassMaterialInline]
    
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
                'prerequisites'
            )
        }),
        ('미디어 정보', {
            'fields': (
                'thumbnail',
                'youtube_url',
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


@admin.register(Curriculum)
class CurriculumAdmin(admin.ModelAdmin):
    """
    커리큘럼 별도 관리 Admin
    """
    list_display = [
        'internal_class',
        'session_number',
        'session_title',
        'get_duration_display',
        'description'
    ]
    
    list_filter = [
        'internal_class__course_type',
        'internal_class',
        'session_number'
    ]
    
    search_fields = [
        'internal_class__title',
        'session_title',
        'description'
    ]
    
    ordering = ['internal_class', 'session_number']
    
    fieldsets = (
        ('기본 정보', {
            'fields': (
                'internal_class',
                'session_number',
                'session_title',
                'duration_minutes'
            )
        }),
        ('수업 내용', {
            'fields': (
                'description',
                'learning_objectives',
                'materials_needed'
            )
        })
    )
    
    def get_duration_display(self, obj):
        """시간 표시"""
        return obj.get_duration_display()
    get_duration_display.short_description = '소요 시간'


@admin.register(ClassMaterial)
class ClassMaterialAdmin(admin.ModelAdmin):
    """
    수업 교구재 별도 관리 Admin
    """
    list_display = [
        'internal_class',
        'name',
        'quantity',
        'unit',
        'is_required',
        'price_estimate',
        'supplier_info'
    ]
    
    list_filter = [
        'internal_class__course_type',
        'internal_class',
        'is_required',
        'unit'
    ]
    
    search_fields = [
        'internal_class__title',
        'name',
        'description',
        'supplier_info'
    ]
    
    ordering = ['internal_class', 'is_required', 'name']
    
    list_editable = ['is_required', 'price_estimate']
    
    fieldsets = (
        ('기본 정보', {
            'fields': (
                'internal_class',
                'name',
                'quantity',
                'unit',
                'is_required'
            )
        }),
        ('상세 정보', {
            'fields': (
                'description',
                'price_estimate',
                'supplier_info'
            )
        })
    )
    
    def get_total_cost_display(self, obj):
        """총 비용 표시 (10명 기준)"""
        total = obj.get_total_price_for_students(10)
        if total:
            return f"₩{total:,} (10명 기준)"
        return "-"
    get_total_cost_display.short_description = '총 비용 (10명)'
