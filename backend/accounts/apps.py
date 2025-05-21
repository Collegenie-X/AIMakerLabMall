from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"
    verbose_name = "User Accounts"

    def ready(self):
        """Initialize Firebase Admin SDK when Django starts"""
        try:
            from config import firebase_admin  # noqa
        except ImportError:
            pass  # Firebase Admin SDK will be initialized elsewhere
