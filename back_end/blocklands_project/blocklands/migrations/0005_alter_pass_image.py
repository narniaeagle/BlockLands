# Generated by Django 4.2 on 2023-04-10 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blocklands', '0004_pass_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pass',
            name='image',
            field=models.URLField(),
        ),
    ]