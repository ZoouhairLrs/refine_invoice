# inventory/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser

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