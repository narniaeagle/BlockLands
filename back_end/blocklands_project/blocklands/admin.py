from django.contrib import admin
from .models import UserProfile, Game, Pass, UserPass
admin.site.register(UserProfile)
admin.site.register(Game)
admin.site.register(Pass)
admin.site.register(UserPass)

