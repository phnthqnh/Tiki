# Generated by Django 5.1.1 on 2024-09-28 17:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_order_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='list_price',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
