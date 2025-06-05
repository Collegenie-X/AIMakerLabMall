from django.contrib import admin
from .models import OutreachInquiry

@admin.register(OutreachInquiry)
class OutreachInquiryAdmin(admin.ModelAdmin):
    """
    코딩 출강 교육 문의 Admin 설정
    """
    list_display = [
        'title',
        'organization_name', 
        'contact_person',
        'course_type',
        'student_count',
        'preferred_date',
        'status',
        'created_at'
    ]
    
    list_filter = [
        'status',
        'course_type',
        'student_grade',
        'created_at',
        'preferred_date'
    ]
    
    search_fields = [
        'title',
        'organization_name',
        'contact_person',
        'email',
        'phone'
    ]
    
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('기본 정보', {
            'fields': (
                'title',
                'organization_name',
                'contact_person',
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
                'location'
            )
        }),
        ('상세 정보', {
            'fields': (
                'message',
                'budget',
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
