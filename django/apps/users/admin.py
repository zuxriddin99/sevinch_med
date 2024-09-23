from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.users.forms import CustomUserCreationForm, CustomUserChangeForm
from apps.users.models import CustomUser


# Register your models here.

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    list_display = ["id", "username", "department_name"]
    list_display_links = ["id", "username"]
    fieldsets = (
        (None, {'fields': ('username', 'password', 'department')}),
        ('Permissions', {'fields': ('is_staff', 'is_active',
                                    'is_superuser')}),
        ('Dates', {'fields': ('last_login', 'date_joined')})
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'is_staff', 'is_active', 'department')}
         ),
    )
    search_fields = ('username',)
    ordering = ('username',)

    @staticmethod
    def department_name(obj):
        return obj.department.name if obj.department else ""
