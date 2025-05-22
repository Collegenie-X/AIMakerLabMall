
## site map 

products/
├── migrations/
├── models/
│   ├── __init__.py
│   ├── product.py
│   └── product_image.py
├── serializers/
│   ├── __init__.py
│   └── product_serializer.py
├── views/
│   ├── __init__.py
│   └── product_views.py
├── admin.py
├── urls.py
└── tests/

# Product API 명세서

## 1. 상품 목록 조회 API

### Request
- Method: `GET`
- Endpoint: `/api/v1/products/`
- Query Parameters:
  - `page`: 페이지 번호 (기본값: 1)
  - `limit`: 페이지당 항목 수 (기본값: 10)
  - `category`: 카테고리 필터 (선택사항)
  - `search`: 검색어 (선택사항)
  - `sort`: 정렬 기준 (options: price_asc, price_desc, latest) (선택사항)

### Response
```json
{
    "status": "success",
    "data": {
        "products": [
            {
                "id": "string",                    // 상품 고유 식별자
                "name": "string",                  // 상품명 (예: 언플러그드 DIY 컴퓨터 만들기)
                "category": "string",              // 상품 카테고리 (예: 초등학교 교육)
                "thumbnail": "string",             // 상품 대표 이미지 URL
                "price": "number",                 // 상품 가격 (원 단위)
                "duration": "string",              // 수업 시간 (예: 2~3시간)
                "status": "string",                // 상품 상태 (초록빛교육전/품절/단종)
                "created_at": "datetime"           // 상품 등록일
            }
        ],
        "meta": {
            "total": "number",                     // 전체 상품 수
            "pages": "number",                     // 전체 페이지 수
            "current_page": "number"               // 현재 페이지 번호
        }
    }
}
```

## 2. 상품 상세 조회 API

### Request
- Method: `GET`
- Endpoint: `/api/v1/products/{product_id}/`

### Response
```json
{
    "status": "success",
    "data": {
        "id": "string",                           // 상품 고유 식별자
        "name": "string",                         // 상품명
        "category": "string",                     // 상품 카테고리
        "description": "string",                  // 상품 간단 설명
        "product_detail_info": "string",          // 상품 상세 설명 (HTML 형식)
        "price": "number",                        // 상품 가격
        "duration": "string",                     // 수업 시간
        "status": "string",                       // 상품 상태
        "images": [                               // 상품 이미지 목록
            {
                "id": "string",                   // 이미지 고유 식별자
                "url": "string",                  // 이미지 URL
                "is_thumbnail": "boolean"         // 대표 이미지 여부
            }
        ],
        "shipping_info": {                        // 배송 정보
            "method": "string",                   // 배송 방법 (택배)
            "fee": "number",                      // 배송비
            "additional_info": "string"           // 추가 배송 정보
        },
        "created_at": "datetime",                 // 상품 등록일
        "updated_at": "datetime"                  // 상품 수정일
    }
}
```



## 상태 코드

- 200: 성공
- 201: 생성 성공
- 400: 잘못된 요청
- 401: 인증 실패
- 403: 권한 없음
- 404: 리소스 없음
- 500: 서버 오류

## 필요한 라이브러리
```plaintext
# requirements.txt에 추가
django-ckeditor==6.7.0
Pillow==10.2.0  # 이미지 처리를 위한 라이브러리
```

## Django 설정
```python
# settings.py에 추가
INSTALLED_APPS = [
    ...
    'ckeditor',
    'ckeditor_uploader',
]

# CKEditor 설정
CKEDITOR_UPLOAD_PATH = "uploads/"
CKEDITOR_IMAGE_BACKEND = "pillow"

CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'height': 300,
        'width': '100%',
    },
    'product_detail': {
        'toolbar': [
            ['Format', 'Bold', 'Italic', 'Underline', 'Strike'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
            ['Image', 'Table'],
            ['Link', 'Unlink'],
            ['RemoveFormat', 'Source']
        ],
        'height': 400,
        'width': '100%',
        'removePlugins': 'stylesheetparser',
        'extraPlugins': 'upload,image2',
    },
}
```

## 데이터 모델

### Product
```python
from ckeditor_uploader.fields import RichTextUploadingField

class Product(models.Model):
    """
    상품 정보를 저장하는 모델
    """
    name = models.CharField(
        max_length=200,
        help_text="상품명 (예: 언플러그드 DIY 컴퓨터 만들기)"
    )
    category = models.CharField(
        max_length=50,
        help_text="상품 카테고리 (예: 초등학교 교육)"
    )
    description = models.TextField(
        help_text="상품 간단 설명"
    )
    product_detail_info = RichTextUploadingField(
        config_name='product_detail',
        help_text="관리자 페이지에서 HTML 에디터로 작성하는 상품 상세 설명"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="상품 가격 (원 단위)"
    )
    duration = models.CharField(
        max_length=50,
        help_text="수업 시간 (예: 2~3시간)"
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('available', '판매 가능'),
            ('out_of_stock', '품절'),
            ('discontinued', '단종')
        ],
        help_text="상품 판매 상태"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="상품 등록일"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="상품 수정일"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = '상품'
        verbose_name_plural = '상품 목록'

class ProductImage(models.Model):
    """
    상품 이미지 정보를 저장하는 모델
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        help_text="연결된 상품"
    )
    image = models.ImageField(
        upload_to='products/',
        help_text="상품 이미지 파일"
    )
    is_thumbnail = models.BooleanField(
        default=False,
        help_text="대표 이미지 여부"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="이미지 등록일"
    )

    class Meta:
        verbose_name = '상품 이미지'
        verbose_name_plural = '상품 이미지 목록'

 실제로 판매하는 부분에서는 naver storeform을 이용하여 진행하기 때문에, REST API에서 결제,배송,구매부분이 필요가 없습니다. 단지 소개하고 알려주는 위주로 사용합니다.

## Admin 설정
```python
# admin.py
from django.contrib import admin
from .models import Product, ProductImage, ShippingInfo

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'status', 'created_at')
    list_filter = ('category', 'status', 'created_at')
    search_fields = ('name', 'description')
    inlines = [ProductImageInline, ShippingInfoInline]
    fieldsets = (
        ('기본 정보', {
            'fields': ('name', 'category', 'price', 'duration', 'status')
        }),
        ('상품 설명', {
            'fields': ('description', 'product_detail_info'),
            'classes': ('wide',)
        }),
    )
```

## URL 설정
```python
# urls.py에 추가
from django.conf.urls import include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    ...
    path('ckeditor/', include('ckeditor_uploader.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 


cd front 
npm run dev


venv/Scripts/activate
cd backend
python manage.py runserver 

pip install -r requrements.txt
python manage.py migrate  

python manage.py runserver 

