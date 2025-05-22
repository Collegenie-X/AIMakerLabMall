from django.contrib import admin
from django.utils.html import format_html
from products.models.product import Product
from products.models.product_image import ProductImage
from products.models.category import Category
from products.models.tag import Tag

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'description', 'created_at')
    list_filter = ('parent', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'is_thumbnail']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
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

    def get_readonly_fields(self, request, obj=None):
        if obj:  # 수정할 때
            return ('created_at', 'updated_at')
        return ()  # 새로 만들 때

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('thumbnail_preview', 'product', 'is_thumbnail', 'created_at')
    list_filter = ('is_thumbnail', 'created_at')
    search_fields = ('product__name',)
    raw_id_fields = ('product',)

    def thumbnail_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 100px; height: 100px; object-fit: cover;" />', obj.image.url)
        return "No Image"
    
    thumbnail_preview.short_description = '이미지 미리보기'
