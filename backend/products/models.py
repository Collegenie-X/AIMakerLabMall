from django.db import models

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=200, verbose_name='상품명')
    description = models.TextField(blank=True, verbose_name='간단 설명')
    detail_info = models.TextField(verbose_name='상세 설명')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='가격')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성일')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정일')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '상품'
        verbose_name_plural = '상품들'

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE, verbose_name='상품')
    image = models.ImageField(upload_to='products/', verbose_name='이미지')
    is_primary = models.BooleanField(default=False, verbose_name='대표 이미지')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성일')

    class Meta:
        ordering = ['-is_primary', 'created_at']
        verbose_name = '상품 이미지'
        verbose_name_plural = '상품 이미지들'

    def __str__(self):
        return f"{self.product.name}의 이미지 ({'대표' if self.is_primary else '일반'})"
