# Generated by Django 4.2 on 2023-04-10 16:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blocklands', '0003_userprofile_alter_avatar_avatar_alter_game_user_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='pass',
            name='image',
            field=models.URLField(default='https://tr.rbxcdn.com/4c8683653590d24f66c6a37661b0f863/420/420/Image/Png'),
        ),
    ]
