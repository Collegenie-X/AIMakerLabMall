#!/usr/bin/env python
"""
샘플 데이터 생성 스크립트
"""
import os
import sys
import django
from datetime import datetime, timedelta

# Django 설정
if __name__ == "__main__":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    
    from django.contrib.auth import get_user_model
    from outreach_inquiries.models import OutreachInquiry, InternalClass
    
    User = get_user_model()
    
    print("샘플 데이터 생성 시작...")
    
    # 1. 사용자 생성 (이미 있으면 건너뛰기)
    try:
        admin_user = User.objects.get(username='admin')
        print("기존 admin 사용자를 사용합니다.")
    except User.DoesNotExist:
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='admin123',
            is_staff=True,
            is_superuser=True
        )
        print("admin 사용자를 생성했습니다.")
    
    try:
        test_user = User.objects.get(username='testuser')
        print("기존 testuser를 사용합니다.")
    except User.DoesNotExist:
        test_user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='test123'
        )
        print("testuser를 생성했습니다.")
    
    # 2. OutreachInquiry 샘플 데이터 생성
    sample_inquiries = [
        {
            'title': '초등학교 3학년 대상 앱 인벤터 교육',
            'requester_name': '김선생',
            'phone': '02-1234-5678',
            'email': 'kim@school.ac.kr',
            'course_type': 'app-inventor',
            'student_count': 25,
            'student_grade': '초등 3-4학년',
            'preferred_date': datetime.now().date() + timedelta(days=7),
            'preferred_time': '14:00',
            'duration': '2시간',
            'location': '서울초등학교',
            'budget': '50만원',
            'message': '초등학교 3학년 학생들을 대상으로 앱 인벤터 교육을 요청합니다.',
            'status': '접수대기',
            'user': admin_user
        },
        {
            'title': '중학생 아두이노 IoT 프로젝트 수업',
            'requester_name': '이담임',
            'phone': '02-9876-5432',
            'email': 'lee@middle.ac.kr',
            'course_type': 'arduino',
            'student_count': 30,
            'student_grade': '중학생',
            'preferred_date': datetime.now().date() + timedelta(days=14),
            'preferred_time': '15:00',
            'duration': '4시간',
            'location': '강남중학교',
            'budget': '100만원',
            'message': '중학생들이 아두이노를 활용한 IoT 프로젝트를 진행할 수 있도록 도와주세요.',
            'status': '검토중',
            'user': test_user
        },
        {
            'title': '고등학교 Python AI 기초 교육',
            'requester_name': '박교수',
            'phone': '02-5555-1234',
            'email': 'park@high.ac.kr',
            'course_type': 'python',
            'student_count': 35,
            'student_grade': '고등학생',
            'preferred_date': datetime.now().date() + timedelta(days=21),
            'preferred_time': '13:00',
            'duration': '6시간',
            'location': '테크고등학교',
            'budget': '150만원',
            'message': '고등학생들에게 Python을 활용한 AI 기초 교육을 진행해주세요.',
            'status': '견적발송',
            'user': None  # 비로그인 사용자
        },
        {
            'title': '초등학생 스크래치 코딩 체험',
            'requester_name': '최선생님',
            'phone': '031-1111-2222',
            'email': 'choi@elementary.ac.kr',
            'course_type': 'scratch',
            'student_count': 20,
            'student_grade': '초등 5-6학년',
            'preferred_date': datetime.now().date() + timedelta(days=10),
            'preferred_time': '10:00',
            'duration': '3시간',
            'location': '경기초등학교',
            'budget': '80만원',
            'message': '초등학생들이 스크래치로 코딩의 재미를 느낄 수 있는 체험 수업을 원합니다.',
            'status': '확정',
            'user': admin_user
        },
        {
            'title': '로보틱스 여름캠프 프로그램',
            'requester_name': '정코치',
            'phone': '032-7777-8888',
            'email': 'jung@camp.org',
            'course_type': 'robotics',
            'student_count': 15,
            'student_grade': '전체',
            'preferred_date': datetime.now().date() + timedelta(days=30),
            'preferred_time': '09:00',
            'duration': '8시간',
            'location': '인천로봇센터',
            'budget': '200만원',
            'message': '여름캠프에서 진행할 로보틱스 프로그램을 의뢰합니다.',
            'status': '완료',
            'user': test_user
        }
    ]
    
    # 기존 데이터 삭제 후 새로 생성
    OutreachInquiry.objects.all().delete()
    print("기존 문의 데이터를 삭제했습니다.")
    
    for inquiry_data in sample_inquiries:
        inquiry = OutreachInquiry.objects.create(**inquiry_data)
        print(f"문의 생성: {inquiry.title}")
    
    # 3. InternalClass 샘플 데이터 생성
    sample_classes = [
        {
            'title': '아두이노 기초 및 개발환경 구축',
            'course_type': 'arduino',
            'class_type': '오프라인',
            'instructor': '김강사',
            'target_grade': '초등 5-6학년',
            'max_students': 15,
            'current_students': 8,
            'start_date': datetime.now().date() + timedelta(days=7),
            'end_date': datetime.now().date() + timedelta(days=21),
            'class_time': '14:00',
            'duration_hours': 12,
            'sessions': 6,
            'price': 120000,
            'discount_rate': 10,
            'description': '아두이노 보드를 활용한 기초 프로그래밍과 센서 제어를 배웁니다.',
            'is_active': True
        },
        {
            'title': 'Python 기초 코딩 교육',
            'course_type': 'python',
            'class_type': '직접출강',
            'instructor': '이강사',
            'target_grade': '중학생',
            'max_students': 20,
            'current_students': 12,
            'start_date': datetime.now().date() + timedelta(days=14),
            'end_date': datetime.now().date() + timedelta(days=35),
            'class_time': '15:30',
            'duration_hours': 16,
            'sessions': 8,
            'price': 200000,
            'discount_rate': 15,
            'description': 'Python 프로그래밍 언어의 기초부터 실전 프로젝트까지 학습합니다.',
            'location': '서울시 강남구',
            'travel_fee': 50000,
            'is_active': True
        },
        {
            'title': 'AI 코딩과 머신러닝 입문',
            'course_type': 'ai',
            'class_type': '오프라인',
            'instructor': '박박사',
            'target_grade': '고등학생',
            'max_students': 12,
            'current_students': 10,
            'start_date': datetime.now().date() + timedelta(days=21),
            'end_date': datetime.now().date() + timedelta(days=49),
            'class_time': '13:00',
            'duration_hours': 20,
            'sessions': 10,
            'price': 300000,
            'discount_rate': 0,
            'description': 'AI와 머신러닝의 기초 개념부터 실습까지 체계적으로 학습합니다.',
            'is_active': True
        }
    ]
    
    # 기존 데이터 삭제 후 새로 생성
    InternalClass.objects.all().delete()
    print("기존 수업 데이터를 삭제했습니다.")
    
    for class_data in sample_classes:
        internal_class = InternalClass.objects.create(**class_data)
        print(f"수업 생성: {internal_class.title}")
    
    print("\n샘플 데이터 생성 완료!")
    print(f"생성된 문의: {OutreachInquiry.objects.count()}개")
    print(f"생성된 수업: {InternalClass.objects.count()}개")
    print(f"생성된 사용자: {User.objects.count()}개") 