from rest_framework import serializers
from .models import OutreachInquiry, InternalClass, Curriculum, ClassMaterial

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
    # 작성자 정보
    author_name = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    
    class Meta:
        model = OutreachInquiry
        fields = [
            'id',
            'user',
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
            'admin_notes',
            'author_name',
            'is_owner',
            'can_edit'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
        
    def get_author_name(self, obj):
        """작성자명 반환 (로그인 사용자면 username, 아니면 requester_name)"""
        if obj.user:
            return obj.user.username or obj.user.first_name or obj.requester_name
        return obj.requester_name
        
    def get_is_owner(self, obj):
        """현재 사용자가 작성자인지 확인"""
        request = self.context.get('request')
        if request and request.user:
            return obj.is_owner(request.user)
        return False
        
    def get_can_edit(self, obj):
        """현재 사용자가 수정 가능한지 확인"""
        request = self.context.get('request')
        if request and request.user:
            # 관리자는 항상 수정 가능
            if request.user.is_staff or request.user.is_superuser:
                return True
            # 작성자만 수정 가능
            return obj.is_owner(request.user)
        return False
        
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
    author_name = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    
    class Meta:
        model = OutreachInquiry
        fields = [
            'id',
            'title',
            'requester_name',
            'author_name',
            'course_type',
            'course_type_display',
            'student_count',
            'preferred_date',
            'formatted_datetime',
            'duration_display',
            'budget',
            'status',
            'created_at',
            'is_owner'
        ]
        
    def get_author_name(self, obj):
        """작성자명 반환"""
        if obj.user:
            return obj.user.username or obj.user.first_name or obj.requester_name
        return obj.requester_name
        
    def get_is_owner(self, obj):
        """현재 사용자가 작성자인지 확인"""
        request = self.context.get('request')
        if request and request.user:
            return obj.is_owner(request.user)
        return False


# 커리큘럼 시리얼라이저
class CurriculumSerializer(serializers.ModelSerializer):
    """
    커리큘럼 시리얼라이저
    """
    duration_display = serializers.CharField(
        source='get_duration_display',
        read_only=True
    )
    
    class Meta:
        model = Curriculum
        fields = [
            'id',
            'session_number',
            'session_title',
            'duration_minutes',
            'duration_display',
            'description',
            'learning_objectives',
            'materials_needed'
        ]


# 교구재 시리얼라이저
class ClassMaterialSerializer(serializers.ModelSerializer):
    """
    수업 교구재 시리얼라이저
    """
    total_price_for_10 = serializers.SerializerMethodField()
    
    class Meta:
        model = ClassMaterial
        fields = [
            'id',
            'name',
            'quantity',
            'unit',
            'is_required',
            'description',
            'price_estimate',
            'total_price_for_10',
            'supplier_info'
        ]
        
    def get_total_price_for_10(self, obj):
        """10명 기준 총 비용 계산"""
        return obj.get_total_price_for_students(10)


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
    
    # 관련 모델들
    curriculum_items = CurriculumSerializer(many=True, read_only=True)
    materials = ClassMaterialSerializer(many=True, read_only=True)
    
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
            'prerequisites',
            'thumbnail',
            'youtube_url',
            'images',
            'location',
            'travel_fee',
            'is_active',
            'is_enrollable',
            'curriculum_items',
            'materials',
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
    
    # 간소화된 커리큘럼과 교구재 정보
    curriculum_count = serializers.SerializerMethodField()
    required_materials_count = serializers.SerializerMethodField()
    
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
            'youtube_url',
            'is_active',
            'is_enrollable',
            'curriculum_count',
            'required_materials_count'
        ]
        
    def get_curriculum_count(self, obj):
        """커리큘럼 차시 수"""
        return obj.curriculum_items.count()
        
    def get_required_materials_count(self, obj):
        """필수 교구재 수"""
        return obj.materials.filter(is_required=True).count()

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