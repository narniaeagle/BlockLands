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


class UserPassSerializer(serializers.ModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        view_name='userprofile_detail',
        queryset=UserProfile.objects.all() 
    )
    passs = serializers.HyperlinkedRelatedField(
        view_name='pass_detail',
        queryset=Pass.objects.all() 
    )
    bought_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)

    class Meta:
        model = UserPass
        fields = ('id', 'user', 'passs', 'bought_at')

class AvatarSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        view_name='userprofile_detail',
        queryset=UserProfile.objects.all() 
    )
    class Meta:
        model = Avatar
        fields = ('id', 'user', 'head_color', 'torso_color', 'right_arm_color', 'left_arm_color', 'right_leg_color', 'left_leg_color')
