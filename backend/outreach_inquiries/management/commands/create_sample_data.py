from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from outreach_inquiries.models import InternalClass, Curriculum, ClassMaterial, OutreachInquiry

class Command(BaseCommand):
    """
    교육 관련 샘플 데이터 생성 명령어
    """
    help = '교육 수업, 커리큘럼, 교구재 샘플 데이터를 생성합니다'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='기존 데이터를 삭제하고 새로 생성',
        )

    def handle(self, *args, **options):
        """샘플 데이터 생성 메인 로직"""
        if options['clear']:
            self.stdout.write('기존 데이터 삭제 중...')
            self.clear_existing_data()

        self.stdout.write('샘플 데이터 생성 시작...')
        
        # 1. 아두이노 수업 생성
        arduino_class = self.create_arduino_class()
        self.create_arduino_curriculum(arduino_class)
        self.create_arduino_materials(arduino_class)
        
        # 2. 파이썬 수업 생성  
        python_class = self.create_python_class()
        self.create_python_curriculum(python_class)
        self.create_python_materials(python_class)
        
        # 3. AI 코딩 수업 생성
        ai_class = self.create_ai_class()
        self.create_ai_curriculum(ai_class)
        self.create_ai_materials(ai_class)
        
        # 4. 샘플 문의 생성
        self.create_sample_inquiries()
        
        self.stdout.write(
            self.style.SUCCESS('샘플 데이터 생성이 완료되었습니다!')
        )

    def clear_existing_data(self):
        """기존 데이터 삭제"""
        ClassMaterial.objects.all().delete()
        Curriculum.objects.all().delete()
        InternalClass.objects.all().delete()
        OutreachInquiry.objects.all().delete()

    def create_arduino_class(self):
        """아두이노 수업 생성"""
        return InternalClass.objects.create(
            title="아두이노 기초 및 IoT 프로젝트",
            course_type="arduino",
            class_type="오프라인",
            instructor="김아두 강사",
            target_grade="초등 5-6학년",
            max_students=15,
            current_students=8,
            start_date=timezone.now().date() + timedelta(days=7),
            end_date=timezone.now().date() + timedelta(days=21),
            class_time="14:00",
            duration_hours=12,
            sessions=4,
            price=150000,
            discount_rate=20,
            description="아두이노의 기본 개념부터 센서를 활용한 IoT 프로젝트까지 단계별로 학습합니다. 코딩과 하드웨어를 동시에 경험할 수 있는 융합 교육 프로그램입니다.",
            prerequisites="컴퓨터 기본 조작 가능, 간단한 수학 연산 이해",
            youtube_url="https://youtube.com/watch?v=arduino_sample",
            images=["arduino_class1.jpg", "arduino_class2.jpg", "arduino_project.jpg"],
            is_active=True
        )

    def create_arduino_curriculum(self, arduino_class):
        """아두이노 커리큘럼 생성"""
        curriculums = [
            {
                'session_number': 1,
                'session_title': '아두이노 기초 및 개발환경 구축',
                'duration_minutes': 180,
                'description': '아두이노의 기본 개념과 개발환경 설정을 학습합니다.',
                'learning_objectives': [
                    '아두이노 보드의 구조와 원리 이해',
                    '아두이노 IDE 설치 및 설정',
                    '기본 회로 구성 방법',
                    '첫 번째 LED 점멸 프로그램'
                ]
            },
            {
                'session_number': 2,
                'session_title': '다양한 센서 연결 및 데이터 수집',
                'duration_minutes': 180,
                'description': '온도, 습도, 조도 센서를 활용한 데이터 수집을 학습합니다.',
                'learning_objectives': [
                    '온도/습도 센서 활용',
                    '조도 센서와 LED 제어',
                    '음직임 감지 센서 응용',
                    '센서 데이터 시리얼 모니터링'
                ]
            },
            {
                'session_number': 3,
                'session_title': 'IoT 프로젝트 제작 및 클라우드 연동',
                'duration_minutes': 180,
                'description': '수집한 데이터를 클라우드로 전송하는 IoT 시스템을 구축합니다.',
                'learning_objectives': [
                    'WiFi 모듈 연결 및 설정',
                    '클라우드 데이터베이스 연동',
                    '스마트홈 시뮬레이션',
                    '프로젝트 발표 및 시연'
                ]
            }
        ]
        
        for curr_data in curriculums:
            Curriculum.objects.create(
                internal_class=arduino_class,
                **curr_data
            )

    def create_arduino_materials(self, arduino_class):
        """아두이노 교구재 생성"""
        materials = [
            {
                'name': '아두이노 우노 보드',
                'quantity': 1,
                'unit': '개',
                'is_required': True,
                'description': 'Arduino UNO R3 정품 또는 호환품',
                'price_estimate': 25000,
                'supplier_info': '디바이스마트, 엘레파츠'
            },
            {
                'name': '브레드보드',
                'quantity': 1,
                'unit': '개',
                'is_required': True,
                'description': '830 포인트 브레드보드',
                'price_estimate': 3000,
                'supplier_info': '디바이스마트'
            },
            {
                'name': 'LED 세트',
                'quantity': 1,
                'unit': '세트',
                'is_required': True,
                'description': '5색 LED 각 5개씩 (빨강, 노랑, 초록, 파랑, 흰색)',
                'price_estimate': 2000,
                'supplier_info': '엘레파츠'
            },
            {
                'name': '저항 키트',
                'quantity': 1,
                'unit': '세트',
                'is_required': True,
                'description': '220Ω, 1kΩ, 10kΩ 저항 각 10개',
                'price_estimate': 3000,
                'supplier_info': '디바이스마트'
            },
            {
                'name': '온습도 센서 (DHT22)',
                'quantity': 1,
                'unit': '개',
                'is_required': True,
                'description': '디지털 온습도 센서',
                'price_estimate': 8000,
                'supplier_info': '디바이스마트'
            },
            {
                'name': '점퍼선 세트',
                'quantity': 1,
                'unit': '세트',
                'is_required': True,
                'description': 'M-M, M-F, F-F 점퍼선 각 10개',
                'price_estimate': 5000,
                'supplier_info': '엘레파츠'
            },
            {
                'name': 'WiFi 모듈 (ESP8266)',
                'quantity': 1,
                'unit': '개',
                'is_required': False,
                'description': 'IoT 연동용 WiFi 모듈',
                'price_estimate': 12000,
                'supplier_info': '디바이스마트'
            }
        ]
        
        for material_data in materials:
            ClassMaterial.objects.create(
                internal_class=arduino_class,
                **material_data
            )

    def create_python_class(self):
        """파이썬 수업 생성"""
        return InternalClass.objects.create(
            title="파이썬 프로그래밍 기초",
            course_type="python",
            class_type="오프라인",
            instructor="박파이 강사",
            target_grade="중학생",
            max_students=20,
            current_students=12,
            start_date=timezone.now().date() + timedelta(days=14),
            end_date=timezone.now().date() + timedelta(days=35),
            class_time="10:00",
            duration_hours=16,
            sessions=8,
            price=120000,
            discount_rate=15,
            description="프로그래밍 입문자를 위한 파이썬 기초 과정입니다. 게임 만들기, 웹 크롤링 등 재미있는 프로젝트를 통해 프로그래밍의 기초를 다집니다.",
            prerequisites="컴퓨터 기본 조작 가능",
            youtube_url="https://youtube.com/watch?v=python_sample",
            images=["python_class1.jpg", "python_coding.jpg"],
            is_active=True
        )

    def create_python_curriculum(self, python_class):
        """파이썬 커리큘럼 생성"""
        curriculums = [
            {
                'session_number': 1,
                'session_title': '파이썬 기초 문법',
                'duration_minutes': 120,
                'description': '파이썬의 기본 문법과 데이터 타입을 학습합니다.',
                'learning_objectives': [
                    '파이썬 설치 및 개발환경 설정',
                    '변수와 데이터 타입',
                    '기본 연산자',
                    '입력과 출력'
                ]
            },
            {
                'session_number': 2,
                'session_title': '조건문과 반복문',
                'duration_minutes': 120,
                'description': '프로그램의 흐름을 제어하는 조건문과 반복문을 학습합니다.',
                'learning_objectives': [
                    'if문 활용하기',
                    'for문과 while문',
                    '중첩 반복문',
                    '간단한 게임 만들기'
                ]
            }
        ]
        
        for curr_data in curriculums:
            Curriculum.objects.create(
                internal_class=python_class,
                **curr_data
            )

    def create_python_materials(self, python_class):
        """파이썬 교구재 생성"""
        materials = [
            {
                'name': '노트북 또는 데스크톱',
                'quantity': 1,
                'unit': '대',
                'is_required': True,
                'description': 'Python 개발이 가능한 컴퓨터',
                'price_estimate': 0,
                'supplier_info': '개인 준비'
            },
            {
                'name': '파이썬 교재',
                'quantity': 1,
                'unit': '권',
                'is_required': False,
                'description': '초보자를 위한 파이썬 교재',
                'price_estimate': 25000,
                'supplier_info': '교보문고, 예스24'
            }
        ]
        
        for material_data in materials:
            ClassMaterial.objects.create(
                internal_class=python_class,
                **material_data
            )

    def create_ai_class(self):
        """AI 코딩 수업 생성"""
        return InternalClass.objects.create(
            title="AI 기초 및 머신러닝 체험",
            course_type="ai",
            class_type="직접출강",
            instructor="이에이 강사",
            target_grade="고등학생",
            max_students=12,
            current_students=5,
            start_date=timezone.now().date() + timedelta(days=21),
            end_date=timezone.now().date() + timedelta(days=42),
            class_time="15:00",
            duration_hours=20,
            sessions=10,
            price=200000,
            discount_rate=10,
            description="인공지능의 기본 개념부터 간단한 머신러닝 모델 만들기까지 체험할 수 있는 과정입니다.",
            prerequisites="파이썬 기초 문법 이해",
            youtube_url="https://youtube.com/watch?v=ai_sample",
            location="강남구 OO고등학교",
            travel_fee=50000,
            is_active=True
        )

    def create_ai_curriculum(self, ai_class):
        """AI 커리큘럼 생성"""
        curriculums = [
            {
                'session_number': 1,
                'session_title': 'AI 개념 및 역사',
                'duration_minutes': 120,
                'description': '인공지능의 기본 개념과 발전 과정을 학습합니다.',
                'learning_objectives': [
                    'AI의 정의와 분류',
                    'AI 발전 역사',
                    'AI 활용 사례',
                    '미래 AI 전망'
                ]
            }
        ]
        
        for curr_data in curriculums:
            Curriculum.objects.create(
                internal_class=ai_class,
                **curr_data
            )

    def create_ai_materials(self, ai_class):
        """AI 교구재 생성"""
        materials = [
            {
                'name': '고성능 노트북',
                'quantity': 1,
                'unit': '대',
                'is_required': True,
                'description': 'Python, Jupyter Notebook 실행 가능한 컴퓨터',
                'price_estimate': 0,
                'supplier_info': '학교 또는 개인 준비'
            }
        ]
        
        for material_data in materials:
            ClassMaterial.objects.create(
                internal_class=ai_class,
                **material_data
            )

    def create_sample_inquiries(self):
        """샘플 문의 생성"""
        inquiries = [
            {
                'title': '초등학교 방과후 아두이노 수업 문의',
                'requester_name': '김담당',
                'phone': '02-1234-5678',
                'email': 'teacher@school.kr',
                'course_type': 'arduino',
                'student_count': 20,
                'student_grade': '초등 3-4학년',
                'preferred_date': timezone.now().date() + timedelta(days=30),
                'preferred_time': '15:00',
                'duration': '2시간',
                'location': '서울시 강남구 OO초등학교',
                'budget': '100만원 내외',
                'message': '방과후 활동으로 아두이노 수업을 진행하려고 합니다. 초등학교 저학년도 이해할 수 있는 수준으로 부탁드립니다.',
                'status': '접수대기'
            },
            {
                'title': '중학교 파이썬 코딩 특강',
                'requester_name': '박선생',
                'phone': '031-987-6543',
                'email': 'coding@middle.kr',
                'course_type': 'python',
                'student_count': 30,
                'student_grade': '중학생',
                'preferred_date': timezone.now().date() + timedelta(days=45),
                'preferred_time': '14:00',
                'duration': '4시간',
                'location': '경기도 성남시 OO중학교',
                'budget': '150만원',
                'message': '진로 탐색 시간에 코딩 체험을 해보려고 합니다.',
                'status': '검토중'
            }
        ]
        
        for inquiry_data in inquiries:
            OutreachInquiry.objects.create(**inquiry_data) 