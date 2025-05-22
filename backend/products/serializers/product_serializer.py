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
        # 먼저 is_thumbnail이 True인 이미지를 찾고, 없으면 첫 번째 이미지를 사용
        image = obj.images.filter(is_thumbnail=True).first() or obj.images.first()
        if image and image.image:
            return request.build_absolute_uri(image.image.url) if request else image.image.url
        return None

    def get_tags(self, obj):
        return [tag.name for tag in obj.tags.all()]

class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = serializers.CharField(source='category.name')
    tags = serializers.SerializerMethodField()
    product_detail_info = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'description',
            'product_detail_info', 'price', 'duration',
            'status', 'images', 'tags', 'created_at', 'updated_at'
        ]
    
    def get_tags(self, obj):
        return [tag.name for tag in obj.tags.all()]
        
    def get_product_detail_info(self, obj):
        if obj.product_detail_info:
            # HTML 내용은 그대로 유지하되, 불필요한 이스케이프 문자 제거
            return obj.product_detail_info.replace('\r\n', '')
            
    def get_description(self, obj):
        if obj.description:
            # 줄바꿈 문자 제거 후 '- '로 split
            text = obj.description.replace('\r\n', ' ').strip()
            # '-'로 시작하는 항목들을 분리하고 각 항목의 앞뒤 공백 제거
            items = [item.strip().lstrip('-').strip() for item in text.split('-') if item.strip()]
            return items 