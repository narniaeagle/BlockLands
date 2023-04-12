from rest_framework import serializers
from .models import UserProfile, UserPass, Avatar, Game, Pass
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        view_name='user_detail',
        read_only=True
    )
    class Meta:
       model = UserProfile
       fields = ('id', 'user', 'coins')

class GameSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        view_name='userprofile_detail',
        queryset=UserProfile.objects.all() 
    )
    class Meta:
        model = Game
        fields = ('id', 'user', 'name', 'description', 'image')


class PassSerializer(serializers.HyperlinkedModelSerializer):
    game = serializers.HyperlinkedRelatedField(
        view_name='game_detail',
        queryset=Game.objects.all() 
    )
    class Meta:
        model = Pass
        fields = ('id', 'game', 'name', 'description', 'price', 'image')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        view_name='user_detail',
        read_only=True
    )
    class Meta:
        model = User
        fields = ('id', 'user', 'username', 'password', 'email')