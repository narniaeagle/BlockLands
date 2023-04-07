from django.contrib import admin
from .models import User, Game, Pass, UserPass
admin.site.register(User)
admin.site.register(Game)
admin.site.register(Pass)
admin.site.register(UserPass)

