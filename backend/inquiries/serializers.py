from rest_framework import serializers
from .models import Inquiry


class InquirySerializer(serializers.ModelSerializer):
    """
    견적 문의 모델에 대한 직렬화 클래스
    
    견적 문의 객체를 JSON 형식으로 변환하거나 JSON 데이터를 견적 문의 객체로 변환합니다.
    """
    class Meta:
        model = Inquiry
        fields = [
            'id', 'title', 'description', 'inquiry_type',
            'created_at', 'updated_at', 'requester_name'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at'] 