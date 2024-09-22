from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.

class CustomUser(AbstractUser):
    first_name = None
    last_name = None
    department = models.ForeignKey("main.Department", on_delete=models.CASCADE, null=True)
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
