# Generated by Django 5.1.1 on 2024-10-04 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_alter_transfer_transfer_method_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='procedure',
            name='discount',
            field=models.IntegerField(default=0),
        ),
    ]