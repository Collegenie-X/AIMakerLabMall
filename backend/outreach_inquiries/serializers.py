from rest_framework import serializers
from .models import OutreachInquiry, InternalClass

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
    formatted_datetime = serializers.CharField(
        source='get_formatted_datetime',
        read_only=True
    )
    duration_display = serializers.CharField(
        source='get_duration_display',
        read_only=True
    )
    
    class Meta:
        model = OutreachInquiry
        fields = [
            'id',
            'title',
            'requester_name',
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
            'formatted_datetime',
            'duration',
            'duration_display',
            'duration_custom',
            'location',
            'budget',
            'message',
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
            'requester_name',
            'phone',
            'email',
            'course_type',
            'student_count',
            'student_grade',
            'preferred_date',
            'preferred_time',
            'duration',
            'duration_custom',
            'location',
            'budget',
            'message',
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
    formatted_datetime = serializers.CharField(
        source='get_formatted_datetime', 
        read_only=True
    )
    duration_display = serializers.CharField(
        source='get_duration_display',
        read_only=True
    )
    
    class Meta:
        model = OutreachInquiry
        fields = [
            'id',
            'title',
            'requester_name',
            'course_type',
            'course_type_display',
            'student_count',
            'preferred_date',
            'formatted_datetime',
            'duration_display',
            'budget',
            'status',
            'created_at'
        ]


# InternalClass 시리얼라이저들
class InternalClassSerializer(serializers.ModelSerializer):
    """
    내부 교육 수업 상세 시리얼라이저
    """
    # 읽기 전용 필드들
    course_type_display = serializers.CharField(
        source='get_course_type_display', 
        read_only=True
    )
    class_type_display = serializers.CharField(
        source='get_class_type_display',
        read_only=True
    )
    formatted_schedule = serializers.CharField(
        source='get_formatted_schedule',
        read_only=True
    )
    discounted_price = serializers.IntegerField(
        source='get_discounted_price',
        read_only=True
    )
    enrollment_rate = serializers.IntegerField(
        source='get_enrollment_rate',
        read_only=True
    )
    is_enrollable = serializers.BooleanField(
        source='can_enroll',
        read_only=True
    )
    
    class Meta:
        model = InternalClass
        fields = [
            'id',
            'title',
            'course_type',
            'course_type_display',
            'class_type',
            'class_type_display',
            'instructor',
            'target_grade',
            'max_students',
            'current_students',
            'start_date',
            'end_date',
            'formatted_schedule',
            'class_time',
            'duration_hours',
            'sessions',
            'price',
            'discount_rate',
            'discounted_price',
            'enrollment_rate',
            'description',
            'curriculum',
            'prerequisites',
            'materials',
            'thumbnail',
            'images',
            'location',
            'travel_fee',
            'is_active',
            'is_enrollable',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'current_students', 'created_at', 'updated_at']

class InternalClassListSerializer(serializers.ModelSerializer):
    """
    내부 교육 수업 목록용 간소화된 시리얼라이저
    """
    course_type_display = serializers.CharField(
        source='get_course_type_display', 
        read_only=True
    )
    class_type_display = serializers.CharField(
        source='get_class_type_display',
        read_only=True
    )
    formatted_schedule = serializers.CharField(
        source='get_formatted_schedule',
        read_only=True
    )
    discounted_price = serializers.IntegerField(
        source='get_discounted_price',
        read_only=True
    )
    enrollment_rate = serializers.IntegerField(
        source='get_enrollment_rate',
        read_only=True
    )
    is_enrollable = serializers.BooleanField(
        source='can_enroll',
        read_only=True
    )
    
    class Meta:
        model = InternalClass
        fields = [
            'id',
            'title',
            'course_type',
            'course_type_display',
            'class_type',
            'class_type_display',
            'instructor',
            'target_grade',
            'max_students',
            'current_students',
            'formatted_schedule',
            'duration_hours',
            'price',
            'discount_rate',
            'discounted_price',
            'enrollment_rate',
            'thumbnail',
            'is_active',
            'is_enrollable'
        ]

class ClassEnrollmentSerializer(serializers.ModelSerializer):
    """
    수업 신청용 시리얼라이저 (OutreachInquiry로 변환)
    """
    class_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = OutreachInquiry
        fields = [
            'class_id',
            'requester_name',
            'phone',
            'email',
            'student_count',
            'message',
            'special_requests'
        ]
        
    def create(self, validated_data):
        """수업 신청 시 InternalClass 정보를 기반으로 OutreachInquiry 생성"""
        class_id = validated_data.pop('class_id')
        
        try:
            internal_class = InternalClass.objects.get(id=class_id)
        except InternalClass.DoesNotExist:
            raise serializers.ValidationError("존재하지 않는 수업입니다.")
            
        if not internal_class.can_enroll():
            raise serializers.ValidationError("신청할 수 없는 수업입니다.")
        
        # InternalClass 정보를 바탕으로 OutreachInquiry 생성
        inquiry_data = {
            'title': f"[수업신청] {internal_class.title}",
            'course_type': internal_class.course_type,
            'preferred_date': internal_class.start_date,
            'preferred_time': internal_class.class_time,
            'duration': f"{internal_class.duration_hours}시간",
            'location': internal_class.location or "미정",
            'student_grade': internal_class.target_grade,
            'status': '접수대기',
            **validated_data
        }
        
        return OutreachInquiry.objects.create(**inquiry_data) 