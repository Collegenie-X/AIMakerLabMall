from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OutreachInquiryViewSet

# DRF Router 설정
router = DefaultRouter()
router.register(r'outreach-inquiries', OutreachInquiryViewSet)

urlpatterns = [
    path('api/v1/', include(router.urls)),
] 