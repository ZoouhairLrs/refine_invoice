# inventory/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser
from .models import Produit
from rest_framework import generics
# from .serializers import ProduitSerializer

class ProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produit
        fields = '__all__'
        extra_kwargs = {
            'name': {'required': True},
            'description': {'required': True},
            'category': {'required': True},
            'price': {'required': True},
            'stock': {'required': True},
            'image': {'required': False}
        }


# class ProduitListCreateView(generics.ListCreateAPIView):
#     queryset = Produit.objects.all()
#     serializer_class = ProduitSerializer

#     def perform_create(self, serializer):
#         Produit = serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(**attrs)
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        return attrs

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'first_name', 'last_name', 'role')

    def create(self, validated_data):
        # Create user with the assigned role
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user