from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView,
    LogoutView,
    RegisterView,
    VerifyEmailView,
    KakaoCallbackView,
    GoogleCallbackView,
    UserProfileView,
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-email/<str:token>/", VerifyEmailView.as_view(), name="verify-email"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("kakao/callback/", KakaoCallbackView.as_view(), name="kakao-callback"),
    path("google/login/", GoogleCallbackView.as_view(), name="google-callback"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
]
