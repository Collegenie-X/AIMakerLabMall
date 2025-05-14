# AIMakerLab Mall 백엔드 요구사항

## 1. 시스템 아키텍처

### 1.1 기술 스택
- 프레임워크: Django REST Framework
- 데이터베이스: PostgreSQL
- 인증: JWT (JSON Web Token)
- 이미지 저장소: AWS S3 또는 유사한 클라우드 스토리지

### 1.2 기본 요구사항
- RESTful API 설계 원칙 준수
- JWT 기반의 인증 시스템 구현
- CORS 설정을 통한 프론트엔드와의 안전한 통신
- 환경 변수를 통한 설정 관리
- API 문서화 (Swagger/OpenAPI)

## 2. API 엔드포인트 요구사항

### 2.1 인증 API (/auth)

#### 2.1.1 로그인 
- 엔드포인트: POST /auth/login
- 요청 데이터:
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- 응답 데이터:
  ```typescript
  {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: 'user' | 'admin';
      createdAt: string;
      updatedAt: string;
    }
  }
  ```

#### 2.1.2 회원가입
- 엔드포인트: POST /auth/signup
- 요청 데이터:
  ```typescript
  {
    email: string;
    password: string;
    name: string;
  }
  ```
- 응답: 생성된 사용자 정보

#### 2.1.3 로그아웃
- 엔드포인트: POST /auth/logout
- 인증: 필요
- 응답: 성공 메시지

#### 2.1.4 현재 사용자 정보 조회
- 엔드포인트: GET /auth/me
- 인증: 필요
- 응답: 현재 로그인한 사용자 정보

#### 2.1.5 비밀번호 재설정
- 엔드포인트: POST /auth/forgot-password
  - 요청: { email: string }
- 엔드포인트: POST /auth/reset-password
  - 요청: { token: string, newPassword: string }

### 2.2 상품 API (/products)

#### 2.2.1 상품 목록 조회
- 엔드포인트: GET /products
- 쿼리 파라미터:
  ```typescript
  {
    category?: '로봇' | '코딩' | '인공지능' | '교육키트' | '액세서리';
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'bestseller';
    search?: string;
    page: number;
    limit: number;
  }
  ```
- 응답:
  ```typescript
  {
    products: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      salePrice?: number;
      imageUrl: string;
      images: string[];
      category: ProductCategory;
      stock: number;
      isNew: boolean;
      isBestseller: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  ```

#### 2.2.2 상품 상세 조회
- 엔드포인트: GET /products/{id}
- 응답: 단일 상품 정보

#### 2.2.3 카테고리별 상품 조회
- 엔드포인트: GET /products/category/{category}
- 쿼리 파라미터: ProductFilter (category 제외)
- 응답: ProductListResponse

#### 2.2.4 상품 검색
- 엔드포인트: GET /products/search
- 쿼리 파라미터: ProductFilter + search 텀
- 응답: ProductListResponse

## 3. 데이터 모델

### 3.1 User 모델
```python
class User(AbstractUser):
    email = EmailField(unique=True)
    name = CharField(max_length=100)
    role = CharField(choices=['user', 'admin'])
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

### 3.2 Product 모델
```python
class Product(Model):
    name = CharField(max_length=200)
    description = TextField()
    price = DecimalField(max_digits=10, decimal_places=2)
    sale_price = DecimalField(null=True, blank=True)
    image_url = URLField()
    images = ArrayField(URLField())
    category = CharField(choices=['로봇', '코딩', '인공지능', '교육키트', '액세서리'])
    stock = IntegerField()
    is_new = BooleanField(default=True)
    is_bestseller = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

## 4. 보안 요구사항

### 4.1 인증 및 인가
- JWT 토큰 기반의 인증 구현
- 토큰 만료 시간 설정 (예: Access Token 1시간, Refresh Token 2주)
- 권한 기반 접근 제어 (RBAC) 구현
- 비밀번호 암호화 저장 (Django의 기본 해시 함수 사용)

### 4.2 데이터 보안
- 입력 데이터 검증 및 살균
- SQL 인젝션 방지
- XSS 방지
- CSRF 보호

### 4.3 API 보안
- Rate Limiting 구현
- 요청 크기 제한
- 적절한 HTTP 상태 코드 사용
- 에러 응답 표준화

## 5. 성능 요구사항

### 5.1 응답 시간
- API 응답 시간 < 500ms (평균)
- 이미지 최적화 처리

### 5.2 데이터베이스
- 적절한 인덱스 설정
- 쿼리 최적화
- 캐싱 전략 수립 (Redis 사용 권장)

### 5.3 확장성
- 페이지네이션 구현
- 대용량 트래픽 처리 방안
- 백그라운드 작업 처리 (Celery 사용 권장)
