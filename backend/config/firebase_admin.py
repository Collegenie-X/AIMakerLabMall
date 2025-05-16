import firebase_admin
from firebase_admin import credentials
import os
from pathlib import Path
from django.conf import settings


def initialize_firebase_admin():
    """Initialize Firebase Admin SDK with error handling"""
    try:
        # Check if already initialized
        if not firebase_admin._apps:
            cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
            default_app = firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK initialized successfully")
        return True
    except Exception as e:
        print(f"Error initializing Firebase Admin SDK: {e}")
        return False


# Initialize Firebase Admin SDK
initialize_firebase_admin()
