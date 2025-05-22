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
        cleaned_data = super().clean()
        image = cleaned_data.get('image')
        media_file = cleaned_data.get('media_file')

        # 미디어 파일이 선택되었으면 이미지로 사용
        if media_file:
            from django.core.files import File
            import os
            
            file_path = os.path.join(settings.MEDIA_ROOT, media_file)
            if os.path.exists(file_path):
                # 파일을 메모리에 완전히 읽어서 처리하여 닫히는 문제 방지
                with open(file_path, 'rb') as f:
                    file_content = f.read()
                    file_name = os.path.basename(media_file)
                    
                # 파일 내용으로부터 새 File 객체 생성
                from io import BytesIO
                file_buffer = BytesIO(file_content)
                file_buffer.name = file_name
                cleaned_data['image'] = File(file_buffer)
        
        # 이미지와 미디어 파일 모두 없으면 오류 표시
        if not cleaned_data.get('image') and not media_file:
            raise ValidationError('이미지를 업로드하거나 미디어 파일에서 선택해주세요.')

        return cleaned_data

class ProductImageInlineFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()
        has_thumbnail = False
        for form in self.forms:
            if not form.is_valid():
                continue
            if form.cleaned_data and not form.cleaned_data.get('DELETE', False):
                if form.cleaned_data.get('is_thumbnail'):
                    has_thumbnail = True
                    
        if not has_thumbnail and self.instance.pk:  # 수정할 때만 체크
            raise ValidationError('최소한 하나의 이미지는 대표 이미지로 지정해야 합니다.')

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    formset = ProductImageInlineFormSet
    form = ProductImageForm
    extra = 1
    min_num = 0
    validate_min = False
    fields = ['image', 'media_file', 'is_thumbnail', 'image_preview']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return mark_safe(f'<a href="{obj.image.url}" target="_blank"><img src="{obj.image.url}" width="100" height="100" style="object-fit: cover;" /></a>')
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
    product_detail_info = forms.CharField(
        widget=CKEditorUploadingWidget(config_name='product_detail'),
        required=False
    )
    
    class Meta:
        model = Product
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        if self.instance.pk:  # 수정할 때만 이미지 검증
            if not self.instance.images.filter(is_thumbnail=True).exists():
                raise ValidationError('최소한 하나의 이미지는 대표 이미지로 지정해야 합니다.')
        return cleaned_data

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = ('thumbnail', 'id', 'name', 'category', 'tag_list', 'price', 'status', 'created_at')
    list_filter = ('category', 'tags', 'status', 'created_at')
    search_fields = ('name', 'description')
    filter_horizontal = ('tags',)
    inlines = [ProductImageInline]
    
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
