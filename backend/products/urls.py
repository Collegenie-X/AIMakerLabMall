from django.urls import path
from products.views.product_views import ProductListView, ProductDetailView

app_name = 'products'

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
] 