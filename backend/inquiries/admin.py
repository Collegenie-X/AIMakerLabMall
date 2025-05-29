from django.contrib import admin
from django import forms
from django.contrib.auth import get_user_model
from .models import Inquiry

User = get_user_model()


class InquiryAdminForm(forms.ModelForm):
    """
    견적 문의 관리자 폼
    
    사용자 선택 시 이메일 정보를 함께 표시합니다.
    """
    class Meta:
        model = Inquiry
        fields = '__all__'
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'user' in self.fields:
            self.fields['user'].queryset = User.objects.all()
            self.fields['user'].label_from_instance = lambda obj: f"{obj.username} ({obj.email})"


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    """
    견적 문의 관리자 인터페이스 설정
    
    Django 관리자 페이지에서 견적 문의를 관리하기 위한 설정을 정의합니다.
    """
    form = InquiryAdminForm
    list_display = ['id', 'title', 'inquiry_type', 'user_email', 'requester_name', 'created_at']
    list_filter = ['inquiry_type', 'created_at', 'user']
    search_fields = ['title', 'requester_name', 'description', 'user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = [
        ('기본 정보', {
            'fields': ['title', 'requester_name', 'inquiry_type', 'user']
        }),
        ('상세 내용', {
            'fields': ['description']
        }),
        ('시스템 정보', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]
    
    def user_email(self, obj):
        """
        사용자 이메일을 반환하는 메서드
        
        Args:
            obj: Inquiry 인스턴스
            
        Returns:
            str: 사용자 이메일 또는 '없음'
        """
        if obj.user:
            return obj.user.email
        return '없음'
    
    user_email.short_description = '작성자 이메일'
    user_email.admin_order_field = 'user__email'
