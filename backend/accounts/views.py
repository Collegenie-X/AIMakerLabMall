from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .serializers import LoginSerializer
from .models import EmailVerificationToken
import os
import requests
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from firebase_admin import auth

User = get_user_model()


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    "user": {
                        "email": user.email,
                        "name": user.get_full_name() or user.email,
                    },
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")

            if not email or not password:
                return Response(
                    {"error": "Email and password are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if User.objects.filter(email=email).exists():
                return Response(
                    {"email": "User with this email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.create_user(
                username=email, email=email, password=password
            )

            # Create verification token
            verification_token = EmailVerificationToken.objects.create(user=user)

            # TODO: Send verification email

            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    "user": {
                        "email": user.email,
                        "name": user.get_full_name() or user.email,
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    def get(self, request, token):
        try:
            verification_token = EmailVerificationToken.objects.get(token=token)
            if verification_token.is_verified:
                return Response(
                    {"error": "Email already verified"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = verification_token.user
            user.is_active = True
            user.save()

            verification_token.is_verified = True
            verification_token.save()

            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    "message": "Email verified successfully",
                }
            )
        except EmailVerificationToken.DoesNotExist:
            return Response(
                {"error": "Invalid verification token"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class KakaoCallbackView(APIView):
    def post(self, request):
        try:
            code = request.data.get("code")
            print(f"Received Kakao auth code: {code}")

            print("client_id", settings.KAKAO_CLIENT_ID)
            print("client_secret", settings.KAKAO_CLIENT_SECRET)
            print("redirect_uri", settings.KAKAO_REDIRECT_URI)

            # Get access token from Kakao
            token_url = "https://kauth.kakao.com/oauth/token"
            data = {
                "grant_type": "authorization_code",
                "client_id": settings.KAKAO_CLIENT_ID,
                "client_secret": settings.KAKAO_CLIENT_SECRET,
                "redirect_uri": settings.KAKAO_REDIRECT_URI,
                "code": code,
            }
            print(f"Requesting Kakao token with data: {data}")

            token_response = requests.post(token_url, data=data)
            token_data = token_response.json()
            print(f"Kakao token response: {token_data}")

            if "error" in token_data:
                return Response(
                    {
                        "error": f"Failed to get Kakao token: {token_data.get('error_description', 'Unknown error')}"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            access_token = token_data.get("access_token")
            if not access_token:
                return Response(
                    {"error": "No access token in Kakao response"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get user info from Kakao
            user_url = "https://kapi.kakao.com/v2/user/me"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            }
            print("Requesting Kakao user info...")
            user_response = requests.get(user_url, headers=headers)
            user_data = user_response.json()
            print(f"Kakao user info response: {user_data}")

            kakao_account = user_data.get("kakao_account", {})
            if not kakao_account:
                return Response(
                    {"error": "Failed to get Kakao account info"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            email = kakao_account.get("email")
            if not email:
                return Response(
                    {"error": "Email not provided by Kakao"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # 카카오 프로필 정보 가져오기
            profile = kakao_account.get("profile", {})
            nickname = profile.get("nickname")
            profile_image = profile.get("profile_image_url")

            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email,
                    "is_active": True,
                    "email_verified": True,
                    "first_name": nickname or "",
                },
            )

            if not created and nickname and not user.first_name:
                user.first_name = nickname
                user.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    "user": {
                        "email": user.email,
                        "name": nickname or user.email,
                        "profile_image": profile_image,
                    },
                }
            )

        except Exception as e:
            print(f"Error in KakaoCallbackView: {str(e)}")
            return Response(
                {"error": f"Kakao login failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GoogleCallbackView(APIView):
    def post(self, request):
        try:
            # Firebase ID 토큰 검증
            id_token = request.data.get("id_token")
            if not id_token:
                return Response(
                    {"error": "ID token is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Firebase Admin SDK로 토큰 검증
            decoded_token = auth.verify_id_token(id_token)

            # 사용자 정보 추출
            email = decoded_token.get("email")
            firebase_uid = decoded_token.get("uid")  # Firebase UID 추출

            if not email:
                return Response(
                    {"error": "Email not found in token"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # 이름 정보 가져오기 (없으면 이메일 사용)
            name = decoded_token.get("name", email)

            # 기존 사용자 찾기
            user = User.objects.filter(email=email).first()

            if user:
                # 기존 사용자의 firebase_uid 업데이트
                user.firebase_uid = firebase_uid
                user.save()
            else:
                # 새 사용자 생성
                user = User.objects.create(
                    email=email,
                    username=email,
                    is_active=True,
                    email_verified=True,
                    firebase_uid=firebase_uid,
                )

            # JWT 토큰 생성
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    "user": {
                        "email": user.email,
                        "name": user.get_full_name() or user.email,
                    },
                }
            )

        except auth.InvalidIdTokenError:
            return Response(
                {"error": "Invalid ID token"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Google login failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
