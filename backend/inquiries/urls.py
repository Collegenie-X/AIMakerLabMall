from django.urls import path
from . import views

app_name = 'inquiries'

urlpatterns = [
    # 문의 목록 조회 및 생성
    path('', views.get_inquiry_list, name='inquiry-list'),
    path('create/', views.create_inquiry, name='inquiry-create'),
    
    # 문의 상세 조회, 수정, 삭제
    path('<int:pk>/', views.get_inquiry_detail, name='inquiry-detail'),
    path('<int:pk>/update/', views.update_inquiry, name='inquiry-update'),
    path('<int:pk>/delete/', views.delete_inquiry, name='inquiry-delete'),
] 