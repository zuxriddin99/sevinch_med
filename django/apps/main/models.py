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
