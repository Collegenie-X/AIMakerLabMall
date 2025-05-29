from django.apps import AppConfig


class InquiriesConfig(AppConfig):
    """
    견적 문의 앱 설정 클래스
    
    Django 앱의 기본 설정과 메타데이터를 정의합니다.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'inquiries'
    verbose_name = '교육 키트 견적 문의'
