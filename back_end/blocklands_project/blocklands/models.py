from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    coins = models.CharField(max_length=255, default=0, blank=True)
    
    def __str__(self):
        return self.user.username
    
class Avatar(models.Model):
    avatar = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='avatars')
    head_color = models.CharField(max_length=7)
    torso_color = models.CharField(max_length=7)
    right_arm_color = models.CharField(max_length=7)
    left_arm_color = models.CharField(max_length=7)
    right_leg_color = models.CharField(max_length=7)
    left_leg_color = models.CharField(max_length=7)
    
    def __str__(self):
        return self.avatar

class Game(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='games')
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.URLField()

    def __str__(self):
        return self.name
    
class Pass(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='passes')
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.CharField(max_length=10)
    image = models.URLField()

    def __str__(self):
        return f"{self.game} - {self.name}"
    
class UserPass(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='user_passes')
    passs = models.ForeignKey(Pass, on_delete=models.CASCADE)
    bought_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.passs.name}"