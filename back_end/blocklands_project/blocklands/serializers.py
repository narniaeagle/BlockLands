from rest_framework import serializers
from .models import User, UserPass, Avatar, Game, Pass

class UserSerializer(serializers.HyperlinkedModelSerializer):
    games = serializers.HyperlinkedRelatedField(
        view_name='game_detail',
        many=True,
        read_only=True
    )
    class Meta:
       model = User
       fields = ('id', 'username', 'email', 'password', 'coins', 'games')

class GameSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        view_name='user_detail',
        read_only=True
    )
    class Meta:
        model = Game
        fields = ('id', 'user', 'name', 'description', 'image')