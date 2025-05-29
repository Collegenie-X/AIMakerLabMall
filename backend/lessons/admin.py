from django.contrib import admin
from .models import LessonInquiry

@admin.register(LessonInquiry)
class LessonInquiryAdmin(admin.ModelAdmin):
    """
    수업 문의 관리자 인터페이스 구성
    
    수업 문의 목록에 표시할 필드, 필터링, 검색 등을 설정합니다.
    """
    list_display = ('title', 'inquiry_type', 'requester_name', 'get_user_email', 'created_at')
    list_filter = ('inquiry_type', 'created_at')
    search_fields = ('title', 'description', 'requester_name')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('기본 정보', {
            'fields': ('user', 'title', 'description', 'inquiry_type', 'requester_name')
        }),
        ('수업 정보', {
            'fields': ('target_audience', 'preferred_date', 'participant_count')
        }),
        ('시스템 정보', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_user_email(self, obj):
        """
        사용자 이메일을 반환하는 메서드
        
        관리자 인터페이스의 목록 표시에서 사용합니다.
        """
        return obj.user.email if obj.user else '-'
    get_user_email.short_description = '사용자 이메일'
