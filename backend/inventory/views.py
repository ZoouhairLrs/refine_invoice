from django.shortcuts import render

# Create your views here.

from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets
from .models import Produit  # Make sure you have the correct import
from .serializers import ProduitSerializer  # Import your serializer
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.permissions import IsAuthenticated
from .models import Client
from .serializers import ClientSerializer
from .models import Facture
from .serializers import FactureSerializer

class ProduitListCreateView(generics.ListCreateAPIView):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer

    def perform_create(self, serializer):
        # Save the new produit object
        serializer.save()

    @api_view(['POST'])
    def create_produit(request):
        serializer = ProduitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Log validation errors to see what's wrong
            print(serializer.errors)  # Add this line to log errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    parser_classes = [MultiPartParser, FormParser]  # Add these parsers to handle file uploads

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    # permission_classes = [IsAuthenticated]  # You can remove this if you don't want auth

class FactureViewSet(viewsets.ModelViewSet):
    queryset = Facture.objects.all()
    serializer_class = FactureSerializer

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            # Call the parent method to get the response
            response = super().post(request, *args, **kwargs)
            # Return the access token and success message
            return Response({
                'token': response.data['access'],
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            # Catch exceptions and return a failure message
            return Response({
                'message': 'Login failed',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

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
