# Generated by Django 4.2.11 on 2024-10-29 16:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0005_remove_client_city_remove_client_country_client_pays_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='ice',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='client',
            name='pays',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='client',
            name='ville',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
