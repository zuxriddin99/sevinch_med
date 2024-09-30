from django.contrib import admin

from apps.main.models import ReferralPerson, ReferralItem, Department, ProcedureType, Procedure, \
    Transfer, Product, ExpenseItem


# Register your models here.

class ReferralItemInline(admin.TabularInline):
    model = ReferralItem


@admin.register(ReferralPerson)
class ReferralPersonAdmin(admin.ModelAdmin):
    list_display = ["id", "full_name", "phone_number"]
    inlines = [ReferralItemInline]


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]


@admin.register(ProcedureType)
class ProcedureTypeAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]


@admin.register(Procedure)
class ProcedureTypeAdmin(admin.ModelAdmin):
    list_display = ["id", "department", "client", "was_completed", "number_of_recommended_treatments"]


@admin.register(Transfer)
class TransferAdmin(admin.ModelAdmin):
    list_display = ["id", "transfer_method", "transfer_type", "amount", ]
