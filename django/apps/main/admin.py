from django.contrib import admin

from apps.main.models import ReferralPerson, ReferralItem, Department, ProcedureType, Procedure, \
    Transfer, Product, ExpenseItem, ProcedureItem, ProcedurePrice


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


class ProcedureItemInline(admin.TabularInline):
    model = ProcedureItem
    extra = 0


@admin.register(Procedure)
class ProcedureTypeAdmin(admin.ModelAdmin):
    list_display = ["id", "department", "client", "was_completed", "number_of_recommended_treatments"]
    inlines = [ProcedureItemInline]


@admin.register(Transfer)
class TransferAdmin(admin.ModelAdmin):
    list_display = ["id", "transfer_method", "transfer_type", "amount", 'created_at']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "price"]


@admin.register(ProcedurePrice)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["id", "start_quantity", "end_quantity", "price"]


@admin.register(ProcedureItem)
class ProcedureItemAdmin(admin.ModelAdmin):
    list_display = ["id", "procedure", "n_th_treatment", "price", "is_received", "received_dt", "drug", "adapter", ]
    list_filter = ["n_th_treatment", 'is_received']
