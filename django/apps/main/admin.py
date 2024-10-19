from django.contrib import admin

from apps.main.models import ReferralPerson, ReferralItem, Department, ProcedureType, Procedure, \
    Transfer, Product, ExpenseItem, ProcedureItem, ProcedurePrice
import nested_admin
import nested_admin


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


class ExpanseItemInline(nested_admin.NestedTabularInline):
    model = ExpenseItem
    extra = 1


class ProcedureItemInline(nested_admin.NestedStackedInline):
    model = ProcedureItem
    extra = 1
    inlines = [ExpanseItemInline]


@admin.register(Procedure)
class ProcedureTypeAdmin(nested_admin.NestedModelAdmin):
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
