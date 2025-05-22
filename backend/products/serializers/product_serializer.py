from rest_framework import serializers
from ..models import Product, ProductImage, Category, Tag

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
    category = serializers.CharField(source='category.name')
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'thumbnail', 'tags',
            'price', 'duration', 'status', 'created_at'
        ]

    def get_thumbnail(self, obj):
        request = self.context.get('request')
        thumbnail_image = obj.images.filter(is_thumbnail=True).first()
        if thumbnail_image and thumbnail_image.image:
            return request.build_absolute_uri(thumbnail_image.image.url) if request else thumbnail_image.image.url
        return None

    def get_tags(self, obj):
        return [tag.name for tag in obj.tags.all()]

class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = serializers.CharField(source='category.name')
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'description',
            'product_detail_info', 'price', 'duration',
            'status', 'images', 'tags', 'created_at', 'updated_at'
        ]
    
    def get_tags(self, obj):
        return [tag.name for tag in obj.tags.all()] 