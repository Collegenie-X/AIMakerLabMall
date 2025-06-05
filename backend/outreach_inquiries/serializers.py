from rest_framework import serializers
from .models import OutreachInquiry

class OutreachInquirySerializer(serializers.ModelSerializer):
    """
    코딩 출강 교육 문의 시리얼라이저
    """
    # 읽기 전용 필드들
    course_type_display = serializers.CharField(
        source='get_course_type_display_korean', 
        read_only=True
    )
    formatted_date = serializers.CharField(
        source='get_formatted_date', 
        read_only=True
    )
    formatted_time = serializers.CharField(
        source='get_formatted_time', 
        read_only=True
    )
    
    class Meta:
        model = OutreachInquiry
        fields = [
            'id',
            'title',
            'organization_name',
            'contact_person', 
            'phone',
            'email',
            'course_type',
            'course_type_display',
            'student_count',
            'student_grade',
            'preferred_date',
            'formatted_date',
            'preferred_time',
            'formatted_time',
            'duration',
            'location',
            'message',
            'budget',
            'special_requests',
            'equipment',
            'status',
            'created_at',
            'updated_at',
            'admin_notes'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        
    def validate_student_count(self, value):
        """참여 인원 유효성 검사"""
        if value <= 0:
            raise serializers.ValidationError("참여 인원은 1명 이상이어야 합니다.")
        if value > 100:
            raise serializers.ValidationError("참여 인원은 100명을 초과할 수 없습니다.")
        return value
        
    def validate_phone(self, value):
        """연락처 유효성 검사"""
        import re
        phone_pattern = re.compile(r'^[\d\-\s\(\)]+$')
        if not phone_pattern.match(value):
            raise serializers.ValidationError("올바른 연락처 형식이 아닙니다.")
        return value

class OutreachInquiryCreateSerializer(serializers.ModelSerializer):
    """
    코딩 출강 교육 문의 생성용 시리얼라이저
    """
    class Meta:
        model = OutreachInquiry
        fields = [
            'title',
            'organization_name', 
            'contact_person',
            'phone',
            'email',
            'course_type',
            'student_count',
            'student_grade',
            'preferred_date',
            'preferred_time',
            'duration',
            'location',
            'message',
            'budget',
            'special_requests',
            'equipment'
        ]
        
    def validate_student_count(self, value):
        """참여 인원 유효성 검사"""
        if value <= 0:
            raise serializers.ValidationError("참여 인원은 1명 이상이어야 합니다.")
        if value > 100:
            raise serializers.ValidationError("참여 인원은 100명을 초과할 수 없습니다.")
        return value

class OutreachInquiryListSerializer(serializers.ModelSerializer):
    """
    코딩 출강 교육 문의 목록용 간소화된 시리얼라이저
    """
    course_type_display = serializers.CharField(
        source='get_course_type_display_korean', 
        read_only=True
    )
    formatted_date = serializers.CharField(
        source='get_formatted_date', 
        read_only=True
    )
    
    class Meta:
        model = OutreachInquiry
        fields = [
            'id',
            'title',
            'organization_name',
            'contact_person',
            'course_type',
            'course_type_display',
            'student_count',
            'preferred_date',
            'formatted_date',
            'status',
            'created_at'
        ] 