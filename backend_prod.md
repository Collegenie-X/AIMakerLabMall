````markdown
# `backend_prod.md` (Django 백엔드 요구사항 문서)

이 문서는 **DRF 기반 API 서버**, **Django Admin** 커스터마이징, **파일 구조 최적화**, **serializers 유효성 검사**, **JWT 인증**, 그리고 **URL 버전 관리(/api/v1/)** 를 포함한 핵심 요구사항을 정의합니다.

---

## 1. 데이터베이스 설정  

초기 개발 환경에서는 **SQLite3**를 사용하도록 설정합니다.  
```python
# backend/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  
        'NAME': BASE_DIR / 'db.sqlite3',  
    }
}
````

> SQLite3는 별도 설치 없이 빠르게 시작할 수 있어 초기 개발에 적합합니다 ([GeeksforGeeks][1]).

---

## 2. URL 버전 관리 (`/api/v1/`)

API는 반드시 URL 경로에 버전을 명시하는 **URLPathVersioning** 방식을 사용합니다.

```python
# backend/settings.py
REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS': 
        'rest_framework.versioning.URLPathVersioning',
    'ALLOWED_VERSIONS': ['v1'],
    'DEFAULT_VERSION': 'v1',
}
```

> URLPathVersioning은 `/api/v1/...` 형태로 API 버전을 구분하여, 서로 다른 버전을 **동시 지원**할 수 있게 해 줍니다 ([장고 REST 프레임워크][2]).

프로젝트 최상위 `urls.py`에는 다음과 같이 구성합니다:

```python
# backend/urls.py
from django.urls import path, include

urlpatterns = [
    path('api/v1/auth/',    include('apps.auth_app.urls')),
    path('api/v1/main/',    include('apps.main_app.urls')),
    path('api/v1/product/', include('apps.product_app.urls')),
    path('api/v1/profile/', include('apps.profile_app.urls')),
]
```

> `/api/v1/` 프리픽스를 통해 클라이언트 호출을 단일화합니다 ([Mindbowser][3]).

---

## 3. 애플리케이션 구조 & 생성

기능별 유사성을 고려하여 `manage.py startapp` 으로 다음 **4개 앱**을 만듭니다 ([Medium][4]):

* **`auth_app`**: 회원가입·로그인·JWT 토큰 관리
* **`main_app`**: 메인 페이지(배너·소개)
* **`product_app`**: 교육 키트·수업 문의·FAQ 게시판
* **`profile_app`**: 마이페이지·회원 탈퇴

### 3.1 권장 폴더 구조

```bash
project_root/
├─ manage.py
├─ backend/
│  ├─ settings.py
│  └─ urls.py
├─ apps/
│  ├─ auth_app/
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ views.py
│  │  └─ urls.py
│  ├─ main_app/
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ views.py
│  │  └─ urls.py
│  ├─ product_app/
│  │  ├─ models/
│  │  │  ├─ kit.py
│  │  │  ├─ inquiry.py
│  │  │  └─ faq.py
│  │  ├─ serializers/
│  │  │  ├─ kit.py
│  │  │  ├─ inquiry.py
│  │  │  └─ faq.py
│  │  ├─ views/
│  │  │  ├─ kit.py
│  │  │  ├─ inquiry.py
│  │  │  └─ faq.py
│  │  └─ urls.py
│  └─ profile_app/
│     ├─ models.py
│     ├─ serializers.py
│     ├─ views.py
│     └─ urls.py
└─ core/
   ├─ utils.py
   └─ filters.py
```

> 이 같은 모듈화 구조는 **유지보수성**, **재사용성**, **가독성**을 높입니다 ([Medium][5]).

---

## 4. `product_app` 세분화 예시

`product_app` 안에 **게시판 종류별**(Kit, Inquiry, FAQ)로 완전 분리된 폴더를 두어, **REST API 호출 건수**를 최소화 하고, 한 페이지에서 여러 데이터를 **조합**할 수 있도록 합니다 ([Medium][6]).

### 4.1 모델 (`apps/product_app/models/kit.py`)

```python
from django.db import models

class Kit(models.Model):
    name        = models.CharField(max_length=100)
    price       = models.PositiveIntegerField()
    stock       = models.PositiveIntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
```

### 4.2 직렬화 (`apps/product_app/serializers/kit.py`)

```python
from rest_framework import serializers
from ..models.kit import Kit

class KitSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Kit
        fields = ['id', 'name', 'price', 'stock', 'created_at']
```

### 4.3 뷰셋 (`apps/product_app/views/kit.py`)

```python
from rest_framework import viewsets
from ..models.kit import Kit
from ..serializers.kit import KitSerializer

class KitViewSet(viewsets.ReadOnlyModelViewSet):
    queryset         = Kit.objects.all()
    serializer_class = KitSerializer
```

### 4.4 URL 라우팅 (`apps/product_app/urls.py`)

```python
from rest_framework.routers import DefaultRouter
from .views.kit import KitViewSet
from .views.inquiry import InquiryViewSet
from .views.faq import FAQViewSet

router = DefaultRouter()
router.register(r'kit',     KitViewSet,     basename='kit')
router.register(r'inquiry', InquiryViewSet, basename='inquiry')
router.register(r'faq',     FAQViewSet,     basename='faq')

urlpatterns = router.urls
```

> **DefaultRouter**를 활용해 `/api/v1/product/kit/`, `/api/v1/product/inquiry/`, `/api/v1/product/faq/` 등의 엔드포인트를 자동 생성합니다 ([Medium][7]).

---

## 5. JWT 인증 설정

```bash
# requirements.txt
djangorestframework
djangorestframework-simplejwt
```

```python
# backend/settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

```python
# apps/auth_app/urls.py
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)
from .views import SignupAPIView

urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/',  TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

> `TokenObtainPairView`를 사용해 **access/refresh** 토큰을 발급하고, `/api/v1/auth/` 경로 하위에서 관리합니다 ([Medium][8]).

---

## 6. Django Admin 커스터마이징

```python
# apps/product_app/admin.py
from django.contrib import admin
from .models.kit import Kit
from .models.inquiry import Inquiry
from .models.faq import FAQ

@admin.register(Kit)
class KitAdmin(admin.ModelAdmin):
    list_display  = ('id', 'name', 'price', 'stock')
    list_filter   = ('price',)

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display  = ('id', 'user', 'subject', 'created_at')
    readonly_fields = ('created_at',)

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display  = ('id', 'question', 'category')
    search_fields = ('question',)
```

> Admin 페이지에서 주요 필드를 **한눈에 보고**, **검색·필터링**할 수 있도록 설정합니다 ([Reddit][9]).

---

## 7. 공용 모듈 (`core/`)

* **`utils.py`**: 공통 헬퍼 함수 (예: 토큰 생성, 이메일 발송)
* **`filters.py`**: DRF 커스텀 필터 클래스 (예: 가격 범위 필터)

> 공통 로직을 분리하여 **중복 제거** 및 **모듈화**를 실현합니다 ([Django Forum][10]).
