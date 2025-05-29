from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Inquiry, InquiryType

User = get_user_model()


class InquiryModelTest(TestCase):
    """
    견적 문의 모델 테스트 클래스
    
    견적 문의 모델의 생성 및 기능을 테스트합니다.
    """
    def setUp(self):
        """테스트 실행 전 초기화 함수"""
        self.inquiry_data = {
            'title': '교육 키트 견적 문의',
            'description': '초등학교 수업용 교육 키트 10세트 견적 문의드립니다.',
            'inquiry_type': InquiryType.PRODUCT,
            'requester_name': '김교사',
        }

    def test_create_inquiry(self):
        """견적 문의 생성 테스트 함수"""
        inquiry = Inquiry.objects.create(**self.inquiry_data)
        
        self.assertEqual(inquiry.title, self.inquiry_data['title'])
        self.assertEqual(inquiry.description, self.inquiry_data['description'])
        self.assertEqual(inquiry.inquiry_type, self.inquiry_data['inquiry_type'])
        self.assertEqual(inquiry.requester_name, self.inquiry_data['requester_name'])
        self.assertIsNotNone(inquiry.created_at)
        self.assertIsNotNone(inquiry.updated_at)


class InquiryAPITest(TestCase):
    """
    견적 문의 API 테스트 클래스
    
    견적 문의 관련 API 엔드포인트의 기능을 테스트합니다.
    """
    def setUp(self):
        """테스트 실행 전 초기화 함수"""
        self.client = APIClient()
        
        # 관리자 사용자 생성
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        
        # 견적 문의 데이터
        self.inquiry_data = {
            'title': '교육 키트 견적 문의',
            'description': '초등학교 수업용 교육 키트 10세트 견적 문의드립니다.',
            'inquiry_type': InquiryType.PRODUCT,
            'requester_name': '김교사',
        }
        
        # 테스트용 견적 문의 생성
        self.inquiry = Inquiry.objects.create(**self.inquiry_data)

    def test_get_inquiry_list(self):
        """견적 문의 목록 조회 테스트 함수"""
        url = reverse('inquiries:inquiry-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_get_inquiry_detail(self):
        """견적 문의 상세 조회 테스트 함수"""
        url = reverse('inquiries:inquiry-detail', args=[self.inquiry.pk])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.inquiry_data['title'])

    def test_create_inquiry(self):
        """견적 문의 생성 테스트 함수"""
        url = reverse('inquiries:inquiry-create')
        new_inquiry_data = {
            'title': '새 견적 문의',
            'description': '새로운 견적 문의입니다.',
            'inquiry_type': InquiryType.PRICE,
            'requester_name': '이교사',
        }
        
        response = self.client.post(url, new_inquiry_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Inquiry.objects.count(), 2)
        self.assertEqual(response.data['title'], new_inquiry_data['title'])

    def test_update_inquiry_admin_only(self):
        """관리자만 견적 문의 수정 가능 테스트 함수"""
        url = reverse('inquiries:inquiry-update', args=[self.inquiry.pk])
        updated_data = {
            'title': '수정된 견적 문의',
            'description': self.inquiry_data['description'],
            'inquiry_type': self.inquiry_data['inquiry_type'],
            'requester_name': self.inquiry_data['requester_name'],
        }
        
        # 비인증 사용자 요청 - 실패 예상
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # 관리자로 인증
        self.client.force_authenticate(user=self.admin_user)
        
        # 관리자 요청 - 성공 예상
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], updated_data['title'])

    def test_delete_inquiry_admin_only(self):
        """관리자만 견적 문의 삭제 가능 테스트 함수"""
        url = reverse('inquiries:inquiry-delete', args=[self.inquiry.pk])
        
        # 비인증 사용자 요청 - 실패 예상
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # 관리자로 인증
        self.client.force_authenticate(user=self.admin_user)
        
        # 관리자 요청 - 성공 예상
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Inquiry.objects.count(), 0)
