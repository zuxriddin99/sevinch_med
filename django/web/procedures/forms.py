from django import forms
from django.contrib.auth.models import User
from django import forms
from apps.main.models import Procedure, ProcedureItem, ExpenseItem, Product


class ProcedureForm(forms.ModelForm):
    class Meta:
        model = Procedure
        fields = ['department', 'client', 'procedure_type', 'was_completed', 'description',
                  'number_of_recommended_treatments']


class ProcedureItemForm(forms.ModelForm):
    class Meta:
        model = ProcedureItem
        fields = ['n_th_treatment', 'price']


class ExpenseItemForm(forms.ModelForm):
    class Meta:
        model = ExpenseItem
        fields = ['product', 'quantity', 'amount']


from django.forms import modelformset_factory

ProcedureItemFormSet = modelformset_factory(ProcedureItem, form=ProcedureItemForm, extra=1, can_delete=True)
ExpenseItemFormSet = modelformset_factory(ExpenseItem, form=ExpenseItemForm, extra=1, can_delete=True)
