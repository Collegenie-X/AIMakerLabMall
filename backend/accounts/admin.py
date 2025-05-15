# This file is intentionally empty as we're using the custom User model from the authentication app
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, EmailVerificationToken


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("email", "username", "is_active", "created_at", "last_login")
    list_filter = ("is_active", "is_staff", "created_at", "groups")
    search_fields = ("email", "username", "first_name", "last_name")
    ordering = ("-created_at",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Personal Info"),
            {
                "fields": ("username", "first_name", "last_name"),
                "classes": ("collapse",),
            },
        ),
        (
            _("Status"),
            {
                "fields": ("is_active", "is_staff", "is_superuser"),
            },
        ),
        (
            _("Dates"),
            {
                "fields": ("last_login", "date_joined", "created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )
    readonly_fields = ("created_at", "updated_at", "last_login", "date_joined")

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ("user_email", "is_verified", "created_at", "token")
    list_filter = ("is_verified", "created_at")
    search_fields = ("user__email", "token")
    ordering = ("-created_at",)
    readonly_fields = ("token", "created_at")

    def user_email(self, obj):
        return obj.user.email

    user_email.short_description = "User Email"
    user_email.admin_order_field = "user__email"

    fieldsets = (
        (_("User Information"), {"fields": ("user", "is_verified")}),
        (
            _("Token Details"),
            {"fields": ("token", "created_at"), "classes": ("collapse",)},
        ),
    )
