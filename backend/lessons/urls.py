from django.urls import path
from . import views

app_name = 'lessons'

urlpatterns = [
    # 수업 문의 목록 조회 및 생성
    path('', views.get_lesson_inquiry_list, name='lesson-inquiry-list'),
    path('create/', views.create_lesson_inquiry, name='lesson-inquiry-create'),
    
    # 수업 문의 상세 조회, 수정, 삭제
    path('<int:pk>/', views.get_lesson_inquiry_detail, name='lesson-inquiry-detail'),
    path('<int:pk>/update/', views.update_lesson_inquiry, name='lesson-inquiry-update'),
    path('<int:pk>/delete/', views.delete_lesson_inquiry, name='lesson-inquiry-delete'),
] 