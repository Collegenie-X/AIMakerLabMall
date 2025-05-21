from rest_framework import serializers
from ..models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'url', 'is_thumbnail']

    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

class ProductListSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'thumbnail',
            'price', 'duration', 'status', 'created_at'
        ]

    def get_thumbnail(self, obj):
        request = self.context.get('request')
        thumbnail_image = obj.images.filter(is_thumbnail=True).first()
        if thumbnail_image and thumbnail_image.image:
            return request.build_absolute_uri(thumbnail_image.image.url) if request else thumbnail_image.image.url
        return None

class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'description',
            'product_detail_info', 'price', 'duration',
            'status', 'images', 'created_at', 'updated_at'
        ] 