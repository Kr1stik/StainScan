from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Scan, SystemLog, PasswordResetRequest

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'is_active']

class ScanSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    stain_detected = serializers.CharField()
    confidence_score = serializers.IntegerField()
    date = serializers.DateTimeField(format="%b %d, %Y")
    detectedAt = serializers.SerializerMethodField()
    uploaded_time = serializers.SerializerMethodField()
    is_approved = serializers.BooleanField()

    class Meta:
        model = Scan
        fields = ['id', 'user', 'garment', 'stain_detected', 'confidence_score', 'detectedAt', 'uploaded_time', 'date', 'is_approved']

    def get_detectedAt(self, obj):
        return obj.date.strftime("%I:%M %p") if obj.date else "N/A"

    def get_uploaded_time(self, obj):
        if not obj.date:
            return "N/A"
        from django.utils import timezone
        # Convert database UTC timestamp seamlessly into Asia/Manila local time
        local_datetime = timezone.localtime(obj.date)
        return local_datetime.strftime("%I:%M %p")

class SystemLogSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%b %d, %Y %I:%M %p")

    class Meta:
        model = SystemLog
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class PasswordResetRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordResetRequest
        fields = ['id', 'email', 'created_at', 'is_approved', 'is_used']
        read_only_fields = ['id', 'created_at', 'is_approved', 'is_used']
