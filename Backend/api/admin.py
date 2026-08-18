from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('email', 'full_name')


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = '__all__'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = ('email', 'full_name', 'role', 'is_active', 'is_email_verified', 'created_at')
    list_filter = ('role', 'is_active', 'is_email_verified', 'is_staff', 'is_superuser')
    list_editable = ('is_active', 'is_email_verified')
    search_fields = ('email', 'full_name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'last_login_at')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('full_name', 'avatar_url')}),
        ('Permissions', {'fields': (
            'is_active',
            'is_email_verified',
            'is_staff',
            'is_superuser',
            'groups',
            'user_permissions',
        )}),
        ('Security tokens', {'fields': (
            'email_verification_token',
            'password_reset_token',
            'password_reset_expires',
        )}),
        ('Important dates', {'fields': ('last_login', 'last_login_at', 'created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2'),
        }),
    )
