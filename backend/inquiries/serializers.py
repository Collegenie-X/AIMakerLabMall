from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Inquiry

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    사용자 정보 직렬화 클래스
    
    사용자 기본 정보만 포함합니다.
    """
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'display_name']
        read_only_fields = ['id', 'username', 'email', 'display_name']
        
    def get_display_name(self, obj):
        """
        사용자 표시 이름을 반환하는 메서드
        
        사용자명과 이메일을 조합하여 표시합니다.
        
        Args:
            obj: User 인스턴스
            
        Returns:
            str: 표시용 이름
        """
        return f"{obj.username} ({obj.email})"


class InquirySerializer(serializers.ModelSerializer):
    """
    견적 문의 모델에 대한 직렬화 클래스
    
    견적 문의 객체를 JSON 형식으로 변환하거나 JSON 데이터를 견적 문의 객체로 변환합니다.
    사용자 정보를 중첩하여 표시합니다.
    """
    user = UserSerializer(read_only=True)
    is_owner = serializers.SerializerMethodField()
    
    class Meta:
        model = Inquiry
        fields = [
            'id', 'user', 'title', 'description', 'inquiry_type',
            'created_at', 'updated_at', 'requester_name', 'is_owner'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'is_owner']
    
    def get_is_owner(self, obj):
        """
        현재 요청 사용자가 문의 작성자인지 여부를 반환하는 메서드
        
        Args:
            obj: Inquiry 인스턴스
            
        Returns:
            bool: 작성자인 경우 True, 아닌 경우 False
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.is_owner(request.user)
        return False 