from django.db import models

from apps.base_app.models import BaseModel


# Create your models here.

class Client(BaseModel):
    first_name = models.CharField(max_length=150, default='', blank=True)
    last_name = models.CharField(max_length=150, default='', blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=350, default='', blank=True)
    workplace = models.CharField(max_length=250, default='', blank=True)
    diagnosis = models.TextField(default='', blank=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name} {self.date_of_birth}'
