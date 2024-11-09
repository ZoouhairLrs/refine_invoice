# inventory/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser
from .models import Produit
from rest_framework import generics
from .models import Client
from .models import Facture

# from .serializers import ProduitSerializer

class ProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produit
        fields = ['id', 'name', 'description', 'category', 'price', 'stock', 'image']  # Include the image field

    # Custom update method to handle the image field
    def update(self, instance, validated_data):
        image = validated_data.get('image', None)
        if image:
            instance.image = image  # Update the image if a new one is provided
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.category = validated_data.get('category', instance.category)
        instance.price = validated_data.get('price', instance.price)
        instance.stock = validated_data.get('stock', instance.stock)
        instance.save()
        return instance

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

    def validate(self, data):
        # Log the validated data for debugging
        print("Validated data:", data)
        return data

class FactureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facture
        fields = '__all__'

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