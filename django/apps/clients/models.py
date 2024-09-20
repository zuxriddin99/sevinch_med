from django.db import models

from apps.base_app.models import BaseModel


# Create your models here.

class Client(BaseModel):
    first_name = models.CharField(max_length=150, default='', blank=True)
    last_name = models.CharField(max_length=150, default='', blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
