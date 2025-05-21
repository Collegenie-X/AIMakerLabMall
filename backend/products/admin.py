from django.contrib import admin
from products.models.product import Product
from products.models.product_image import ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'is_thumbnail']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'status', 'created_at')
    list_filter = ('category', 'status', 'created_at')
    search_fields = ('name', 'description')
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('기본 정보', {
            'fields': ('name', 'category', 'price', 'duration', 'status')
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
    list_display = ('product', 'is_thumbnail', 'created_at')
    list_filter = ('is_thumbnail', 'created_at')
    search_fields = ('product__name',)
    raw_id_fields = ('product',)
