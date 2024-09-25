from django import forms
from django.contrib.auth.models import User


class AuthForm(forms.Form):
    remember_me = forms.BooleanField(required=False)
    username = forms.CharField(required=True)
    password = forms.CharField(required=True)

    def clean(self):
        cleaned_data = super().clean()
        return cleaned_data