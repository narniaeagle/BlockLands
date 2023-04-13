from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView
)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('auth/users/', views.UserList.as_view(), name='user_list'),
    path('auth/users/<int:pk>', views.UserDetail.as_view(), name='user_detail'),

    path('users/', views.UserProfileList.as_view(), name='userprofile_list'),
    path('users/<int:pk>', views.UserProfileDetail.as_view(), name='userprofile_detail'),

    path('games/', views.GameList.as_view(), name='game_list'),
    path('games/<int:pk>', views.GameDetail.as_view(), name='game_detail'),

    path('pass/', views.PassList.as_view(), name='pass_list'),
    path('pass/<int:pk>', views.PassDetail.as_view(), name='pass_detail'),

    path('userpass/', views.UserPassList.as_view(), name='userpass_list'),
    path('userpass/<int:pk>', views.UserPassDetail.as_view(), name='userpass_detail'),

    path('avatars/', views.AvatarList.as_view(), name='avatars_list'),
    path('avatars/<int:pk>', views.AvatarDetail.as_view(), name='avatars_detail')
]