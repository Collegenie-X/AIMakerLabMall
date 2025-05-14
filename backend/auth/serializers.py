from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data["email"], password=data["password"])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("이메일 또는 비밀번호가 올바르지 않습니다.")
