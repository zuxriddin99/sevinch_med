from django.db import models
import locale

from apps.base_app.models import BaseModel


# Create your models here.
class Department(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'
        ordering = ['name']
        db_table = 'departments'


class ProcedureType(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Procedure Type'
        verbose_name_plural = 'Procedure Types'
        ordering = ['name']
        db_table = 'procedure_types'


class Procedure(BaseModel):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='department_procedures')
    client = models.ForeignKey("clients.Client", on_delete=models.CASCADE, related_name="procedures")
    procedure_type = models.ForeignKey(
        ProcedureType, on_delete=models.CASCADE, related_name="procedures_for_type", blank=True)
    was_completed = models.BooleanField(default=False)
    description = models.TextField(blank=True, default='')  # dop info
    number_of_recommended_treatments = models.IntegerField(default=0)
    discount = models.IntegerField(default=0)

    def __str__(self):
        return ""

    class Meta:
        verbose_name = 'Procedure'
        verbose_name_plural = 'Procedures'
        db_table = 'procedures'

    @property
    def translated_created_at(self):
        if self.created_at:
            locale.setlocale(locale.LC_TIME, 'uz_UZ.UTF-8')
            return self.created_at.strftime('%Y-yil %-d-%b %H:%M')
        return ""


class ProcedureItem(BaseModel):
    procedure = models.ForeignKey(Procedure, on_delete=models.CASCADE, related_name='items')
    n_th_treatment = models.IntegerField(default=0)
    price = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Procedure item"
        verbose_name_plural = "Procedure items"
        db_table = 'procedure_items'


class Product(BaseModel):
    name = models.CharField(max_length=255)
    price = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class ExpenseItem(BaseModel):
    procedure_item = models.ForeignKey(
        ProcedureItem, on_delete=models.CASCADE, related_name='expenses', blank=True, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_expenses')
    quantity = models.IntegerField(default=0)
    amount = models.IntegerField(default=0)

    def __str__(self):
        return ""


class Transfer(BaseModel):
    class MethodTransferEnum(models.TextChoices):
        CARD = "card", "Terminal orqali to'lov"
        CASH = "cash", "Naqd"
        TRANSFER_TO_CARD = "transfer_to_card", "Karta orqali o'tkazma"

    class TypeTransferEnum(models.TextChoices):
        INCOME = "income", "Kirim"
        EXPENSE = "expense", "Chiqim"

    procedure = models.ForeignKey(
        Procedure, on_delete=models.CASCADE, related_name='procedure_payments', blank=True, null=True)
    transfer_method = models.CharField(choices=MethodTransferEnum.choices, max_length=20)
    transfer_type = models.CharField(choices=TypeTransferEnum.choices, max_length=20)
    amount = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Transfer'
        verbose_name_plural = 'Transfers'
        db_table = 'transfers'


class ReferralPerson(BaseModel):
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, blank=True, default='')
    additional_information = models.TextField(blank=True, default='')

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = 'Referral Person'
        verbose_name_plural = 'Referral Persons'
        db_table = 'referral_persons'

    @property
    def total_invited_people(self):
        return self.referral_items.all().count()

    @property
    def unpaid_invited_people(self):
        return self.referral_items.filter(was_paid=False).count()

    @property
    def formated_phone_number(self):
        if self.phone_number.startswith("+998") and len(self.phone_number) == 13:
            return f"{self.phone_number[:4]} ({self.phone_number[4:6]}) {self.phone_number[6:9]} {self.phone_number[9:11]} {self.phone_number[11:]}"
        else:
            return self.phone_number if self.phone_number else "-"


class ReferralItem(BaseModel):
    referral = models.ForeignKey(ReferralPerson, on_delete=models.CASCADE, related_name='referral_items')
    was_paid = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Referral Item'
        verbose_name_plural = 'Referral Items'
        db_table = 'referral_items'


class ProcedurePrice(BaseModel):
    start_quantity = models.IntegerField(default=0)
    end_quantity = models.IntegerField(default=0)
    price = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Procedure Price'
        verbose_name_plural = 'Procedure Prices'
        db_table = 'procedure_prices'
