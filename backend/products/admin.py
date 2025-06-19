from django.contrib import admin
from django.utils.html import format_html
from django.core.exceptions import ValidationError
from django.forms import BaseInlineFormSet, ModelForm, Select
from django import forms
from django.conf import settings
import os
from products.models.product import Product
from products.models.product_image import ProductImage
from products.models.category import Category
from products.models.tag import Tag
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.utils.safestring import mark_safe

def get_media_files():
    """
    media 폴더의 이미지 파일들을 찾아서 반환
    """
    media_path = os.path.join(settings.MEDIA_ROOT, 'uploads')
    choices = [('', '---------')]  # 빈 선택 옵션 추가
    
    if os.path.exists(media_path):
        for root, dirs, files in os.walk(media_path):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, settings.MEDIA_ROOT)
                    choices.append((rel_path, os.path.basename(rel_path)))
    
    return choices

class ProductImageForm(ModelForm):
    """
    상품 이미지 폼 클래스
    - 미디어 파일 선택 및 업로드 통합
    - 신규/기존 상품별 검증 로직 분리
    """
    
    media_file = forms.ChoiceField(
        choices=get_media_files,
        required=False,
        label='미디어 파일에서 선택'
    )
    
    # 파일 필드 재정의 - 필수가 아니도록 설정
    image = forms.ImageField(
        required=False,
        label='이미지',
        help_text='이미지 파일을 업로드하거나 미디어 파일에서 선택하세요'
    )

    class Meta:
        model = ProductImage
        fields = ['image', 'is_thumbnail', 'media_file']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.image:
            rel_path = str(self.instance.image)
            if rel_path.startswith('/'):
                rel_path = rel_path[1:]
            choices_dict = dict(get_media_files())
            if rel_path in choices_dict:
                self.initial['media_file'] = rel_path

    def clean(self):
        """
        폼 유효성 검사 수행
        - 미디어 파일 선택 시 이미지 자동 설정
        - 빈 폼에서는 이미지 필수 검증 건너뛰기
        - 실제 입력이 있는 경우에만 이미지 필수 검증
        """
        cleaned_data = super().clean()
        image = cleaned_data.get('image')
        media_file = cleaned_data.get('media_file')
        is_thumbnail = cleaned_data.get('is_thumbnail', False)

        # 미디어 파일이 선택되었으면 이미지로 사용
        if media_file:
            cleaned_data['image'] = self._process_media_file(media_file)
        
        # 빈 폼인지 확인 (모든 필드가 비어있는 경우)
        if self._is_empty_form(image, media_file, is_thumbnail):
            return cleaned_data
        
        # 실제 입력이 있는데 이미지가 없으면 오류 표시
        if not cleaned_data.get('image') and not media_file:
            raise ValidationError('이미지를 업로드하거나 미디어 파일에서 선택해주세요.')

        return cleaned_data
    
    def _is_empty_form(self, image, media_file, is_thumbnail):
        """
        빈 폼 여부 확인
        - 이미지, 미디어파일, 썸네일 체크 모두 비어있으면 빈 폼으로 판단
        
        Args:
            image: 업로드된 이미지
            media_file: 선택된 미디어 파일
            is_thumbnail: 썸네일 체크 여부
            
        Returns:
            bool: 빈 폼이면 True
        """
        return not image and not media_file and not is_thumbnail
    
    def _process_media_file(self, media_file):
        """
        선택된 미디어 파일을 이미지 필드로 변환
        - 안전한 파일 경로 처리
        - 파일 존재 여부 확인
        
        Args:
            media_file (str): 미디어 파일 경로
            
        Returns:
            File: Django File 객체 또는 None
        """
        from django.core.files import File
        import os
        from io import BytesIO
        
        if not media_file:
            return None
            
        # 다양한 경로 패턴 시도
        file_paths = [
            os.path.join(settings.MEDIA_ROOT, media_file),
            os.path.join(settings.MEDIA_ROOT, 'uploads', media_file),
            os.path.join(settings.MEDIA_ROOT, 'products', media_file)
        ]
        
        for file_path in file_paths:
            if os.path.exists(file_path):
                try:
                    # 파일을 메모리에 완전히 읽어서 처리
                    with open(file_path, 'rb') as f:
                        file_content = f.read()
                        file_name = os.path.basename(media_file)
                        
                    # 파일 내용으로부터 새 File 객체 생성
                    file_buffer = BytesIO(file_content)
                    file_buffer.name = file_name
                    return File(file_buffer)
                except Exception as e:
                    print(f"파일 처리 오류: {file_path}, {e}")
                    continue
        
        print(f"미디어 파일을 찾을 수 없습니다: {media_file}")
        return None

class ProductImageInlineFormSet(BaseInlineFormSet):
    """
    상품 이미지 인라인 폼셋 클래스
    - 유연한 이미지 관리
    - 검증 로직 단순화
    """
    
    def clean(self):
        """
        기본 검증만 수행
        - 개별 폼의 유효성만 확인
        - 대표 이미지 검증은 save_related에서 처리
        """
        super().clean()
        # 모든 검증을 save_related로 이관하여 유연성 확보
        return

class ProductImageInline(admin.TabularInline):
    """
    상품 이미지 인라인 관리 클래스
    - 유연한 이미지 추가/수정 지원
    - 빈 폼에 대한 관대한 검증
    """
    
    model = ProductImage
    formset = ProductImageInlineFormSet
    form = ProductImageForm
    extra = 1
    min_num = 0
    validate_min = False
    can_delete = True
    fields = ['image', 'media_file', 'is_thumbnail', 'image_preview']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        """
        이미지 미리보기 생성
        - 기존 이미지: 링크가 있는 썸네일 표시
        - 신규 이미지: "No Image" 표시
        """
        if obj.image and hasattr(obj.image, 'url'):
            return mark_safe(
                f'<a href="{obj.image.url}" target="_blank">'
                f'<img src="{obj.image.url}" width="100" height="100" '
                f'style="object-fit: cover;" /></a>'
            )
        return "No Image"
    
    image_preview.short_description = '이미지 미리보기'
    
    class Media:
        js = ('admin/js/image_preview.js',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'description', 'created_at')
    list_filter = ('parent', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')

class ProductAdminForm(forms.ModelForm):
    """
    상품 관리자 폼 클래스
    - CKEditor 통합 상세 설명 필드
    - 유연한 검증 로직
    """
    
    product_detail_info = forms.CharField(
        widget=CKEditorUploadingWidget(config_name='product_detail'),
        required=False
    )
    
    class Meta:
        model = Product
        fields = '__all__'

    def clean(self):
        """
        기본 폼 검증만 수행
        - 이미지 관련 검증은 save_related에서 처리
        """
        cleaned_data = super().clean()
        return cleaned_data

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    상품 관리자 클래스
    - 단계별 상품 생성/수정 처리
    - 이미지 인라인 관리 통합
    """
    
    form = ProductAdminForm
    list_display = ('thumbnail', 'id', 'name', 'category', 'tag_list', 'price', 'status', 'created_at')
    list_filter = ('category', 'tags', 'status', 'created_at')
    search_fields = ('name', 'description')
    filter_horizontal = ('tags',)
    inlines = [ProductImageInline]
    
    def save_related(self, request, form, formsets, change):
        """
        관련 객체들 저장 처리
        - 인라인 이미지들의 안전한 저장
        - 대표 이미지 자동 지정 로직
        
        Args:
            request: HTTP 요청 객체
            form: 메인 폼 인스턴스
            formsets: 인라인 폼셋들
            change: 수정 여부
        """
        # 기본 관련 객체 저장
        super().save_related(request, form, formsets, change)
        
        # 이미지 관련 후처리
        self._post_process_images(form.instance)
    
    def _post_process_images(self, product_instance):
        """
        이미지 저장 후 스마트 처리 로직
        - 대표 이미지 자동 지정 및 중복 방지
        - 유연한 이미지 관리
        
        Args:
            product_instance: Product 모델 인스턴스
        """
        images = product_instance.images.all()
        
        # 이미지가 없는 경우 처리 불필요
        if not images.exists():
            return
            
        # 대표 이미지 상태 확인 및 정리
        self._ensure_single_thumbnail(images)
    
    def _ensure_single_thumbnail(self, images):
        """
        대표 이미지 단일 지정 보장
        - 대표 이미지가 없으면 첫 번째를 지정
        - 여러 개 있으면 첫 번째만 유지
        
        Args:
            images: ProductImage 쿼리셋
        """
        thumbnail_images = images.filter(is_thumbnail=True)
        
        if not thumbnail_images.exists():
            # 대표 이미지가 없으면 첫 번째 이미지를 대표로 지정
            first_image = images.first()
            if first_image:
                first_image.is_thumbnail = True
                first_image.save()
        elif thumbnail_images.count() > 1:
            # 여러 개의 대표 이미지가 있으면 첫 번째만 유지
            first_thumbnail = thumbnail_images.first()
            thumbnail_images.exclude(id=first_thumbnail.id).update(is_thumbnail=False)
    
    def _handle_new_product_creation(self, obj):
        """
        신규 상품 생성 처리
        - primary key 생성을 위한 기본 저장
        """
        obj.save()
    
    def _handle_existing_product_update(self, obj):
        """
        기존 상품 수정 처리
        - 일반적인 저장 절차
        """
        obj.save()
    
    def tag_list(self, obj):
        return ", ".join([tag.name for tag in obj.tags.all()])
    tag_list.short_description = '태그'

    def thumbnail(self, obj):
        if obj.images.filter(is_thumbnail=True).exists():
            image = obj.images.filter(is_thumbnail=True).first()
        else:
            image = obj.images.first()
            
        if image:
            return format_html('<img src="{}" style="width: 100px; height: 100px; object-fit: cover;" />', image.image.url)
        return format_html('<div style="width: 100px; height: 100px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center;">No Image</div>')
    
    thumbnail.short_description = '상품 이미지'
    
    fieldsets = (
        ('기본 정보', {
            'fields': ('name', 'category', 'tags', 'price', 'duration', 'status')
        }),
        ('상품 설명', {
            'fields': ('description', 'product_detail_info'),
            'classes': ('wide',)
        }),
    )

    class Media:
        css = {
            'all': (
                'admin/css/product_image.css',
            )
        }

    def get_readonly_fields(self, request, obj=None):
        if obj:  # 수정할 때
            return ('created_at', 'updated_at')
        return ()  # 새로 만들 때

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    form = ProductImageForm
    list_display = ('thumbnail_preview', 'product', 'is_thumbnail', 'created_at')
    list_filter = ('is_thumbnail', 'created_at')
    search_fields = ('product__name',)
    raw_id_fields = ('product',)

    def thumbnail_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 100px; height: 100px; object-fit: cover;" />', obj.image.url)
        return "No Image"
    
    thumbnail_preview.short_description = '이미지 미리보기'
