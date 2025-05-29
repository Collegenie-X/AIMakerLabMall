from django.contrib import admin
from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    """
    견적 문의 관리자 인터페이스 설정
    
    Django 관리자 페이지에서 견적 문의를 관리하기 위한 설정을 정의합니다.
    """
    list_display = ['id', 'title', 'inquiry_type', 'requester_name', 'created_at']
    list_filter = ['inquiry_type', 'created_at']
    search_fields = ['title', 'requester_name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = [
        ('기본 정보', {
            'fields': ['title', 'requester_name', 'inquiry_type']
        }),
        ('상세 내용', {
            'fields': ['description']
        }),
        ('시스템 정보', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]
