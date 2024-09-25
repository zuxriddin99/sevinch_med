from django.db import models

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
    number_of_recommended_treatments = models.IntegerField(default=0)

    def __str__(self):
        return ""

    class Meta:
        verbose_name = 'Procedure'
        verbose_name_plural = 'Procedures'
        db_table = 'procedures'


class ProcedureItem(BaseModel):
    procedure = models.ForeignKey(Procedure, on_delete=models.CASCADE, related_name='items')
    n_th_treatment = models.IntegerField(default=0)


class PaymentProcedure(BaseModel):
    procedure = models.ForeignKey(Procedure, on_delete=models.CASCADE, related_name='procedure_payments')
    total_amount = models.IntegerField(default=0)  # use integer field because in sum use only integer number
    paid_sum = models.IntegerField(default=0)  # use integer field because in sum use only integer number
    debt_sum = models.IntegerField(default=0)  # use integer field because in sum use only integer number

    def __str__(self):
        return ""

    class Meta:
        verbose_name = 'Payment Procedure'
        verbose_name_plural = 'Payment Procedures'
        db_table = 'payment_procedures'

    # 2 147 483 647


class Transaction(BaseModel):
    class TypeTransactionEnum(models.TextChoices):
        CARD = "card", "Card"
        CASH = "cash", "Cash"

    payment_procedure = models.ForeignKey(
        PaymentProcedure, on_delete=models.CASCADE, related_name='payment_transactions')
    amount = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
        db_table = 'transactions'


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
