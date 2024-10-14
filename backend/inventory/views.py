from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return Response({
            'token': response.data['access'],
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)

from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from .models import CustomUser
from .serializers import UserSerializer

class AdminCreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        # Check if the user is admin before creating
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"email": user.email, "role": user.role}, status=status.HTTP_201_CREATED)
