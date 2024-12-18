# Generated by Django 4.2.11 on 2024-10-28 16:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0003_facture'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='city',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='client',
            name='country',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='client',
            name='ice',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.AlterField(
            model_name='client',
            name='email',
            field=models.EmailField(max_length=254),
        ),
        migrations.AlterField(
            model_name='client',
            name='status',
            field=models.CharField(choices=[('active', 'Actif'), ('inactive', 'Inactif')], max_length=50),
        ),
        migrations.AlterField(
            model_name='client',
            name='type',
            field=models.CharField(choices=[('enterprise', 'Entreprise'), ('individual', 'Particulier')], max_length=50),
        ),
    ]
