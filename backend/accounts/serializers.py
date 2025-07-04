from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    """
    사용자 프로필 직렬화 클래스
    로그인한 사용자의 기본 정보를 반환합니다.
    """
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'name', 'is_active', 'date_joined']
        read_only_fields = ['id', 'email', 'username', 'name', 'is_active', 'date_joined']
    
    def get_name(self, obj):
        """
        사용자 표시 이름을 반환하는 메서드
        """
        return obj.get_full_name() or obj.email


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = User.objects.filter(email=data["email"]).first()
        if user and user.check_password(data["password"]):
            return user
        raise serializers.ValidationError("이메일 또는 비밀번호가 올바르지 않습니다.")
