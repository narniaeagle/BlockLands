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

    path('users/', views.UserList.as_view(), name='user_list'),
    path('users/<int:pk>', views.UserDetail.as_view(), name='user_detail'),
    path('games/', views.GameList.as_view(), name='game_list'),
    path('games/<int:pk>', views.GameDetail.as_view(), name='game_detail')
]