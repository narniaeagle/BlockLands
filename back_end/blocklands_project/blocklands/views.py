from django.shortcuts import render
from rest_framework import generics
from .serializers import UserProfileSerializer, GameSerializer, PassSerializer, UserSerializer, UserPassSerializer
from .models import UserPass, Avatar, Game, Pass, UserProfile
from django.contrib.auth.models import User

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        try:
            user_profile = UserProfile.objects.get(user=user)
            token['username'] = user.username
            token['coins'] = user_profile.coins
        except UserProfile.DoesNotExist:
            pass

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserProfileList(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class UserProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class GameList(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

class GameDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class PassList(generics.ListCreateAPIView):
    queryset = Pass.objects.all()
    serializer_class = PassSerializer

class PassDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pass.objects.all()
    serializer_class = PassSerializer


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserPassList(generics.ListCreateAPIView):
    queryset = UserPass.objects.all()
    serializer_class = UserPassSerializer

class UserPassDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserPass.objects.all()
    serializer_class = UserPassSerializer