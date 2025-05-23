import firebase_admin
from firebase_admin import credentials
import os
from pathlib import Path
from django.conf import settings


def initialize_firebase_admin():
    """Firebase Admin SDK 초기화"""
    try:
        # 이미 초기화되었는지 확인
        if not len(firebase_admin._apps):
            # 서비스 계정 키 파일 경로 확인
            if not os.path.exists(settings.FIREBASE_SERVICE_ACCOUNT_PATH):
                raise FileNotFoundError(
                    f"Firebase 서비스 계정 키 파일을 찾을 수 없습니다: {settings.FIREBASE_SERVICE_ACCOUNT_PATH}"
                )

            # 서비스 계정 인증 정보 로드
            cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)

            # Firebase 앱 초기화
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK 초기화 성공")
            return True
        else:
            print("Firebase Admin SDK가 이미 초기화되어 있습니다.")
            return True
    except Exception as e:
        print(f"Firebase Admin SDK 초기화 오류: {str(e)}")
        return False


# 앱 시작 시 Firebase Admin SDK 초기화
default_app = initialize_firebase_admin()
