from django.contrib import admin
from .models import UserProfile, Game, Pass, UserPass, Avatar
admin.site.register(Avatar)
admin.site.register(UserProfile)
admin.site.register(Game)
admin.site.register(Pass)
admin.site.register(UserPass)

