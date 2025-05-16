from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        """Initialize Firebase Admin SDK when Django starts"""
        try:
            from config import firebase_admin

            # The import itself will initialize Firebase Admin
        except Exception as e:
            print(f"Failed to initialize Firebase Admin: {e}")
