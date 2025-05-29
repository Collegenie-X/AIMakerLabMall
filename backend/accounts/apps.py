from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"
    verbose_name = "User Accounts"

    def ready(self):
        """앱이 시작될 때 실행되는 메서드"""
        # Firebase Admin SDK 초기화
        from config.firebase_admin import initialize_firebase_admin

        initialize_firebase_admin()
