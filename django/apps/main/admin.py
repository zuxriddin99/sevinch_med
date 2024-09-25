from django.contrib import admin

from apps.main.models import ReferralPerson, ReferralItem, Department, ProcedureType, Procedure, PaymentProcedure, \
    Transaction


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


@admin.register(PaymentProcedure)
class PaymentProcedureAdmin(admin.ModelAdmin):
    list_display = ["id", "procedure", "total_amount", "paid_sum", "debt_sum"]
