from django.db import models
from django.contrib.auth.models import User
import uuid

class Scan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scans', null=True, blank=True)
    garment = models.CharField(max_length=255)
    stain_detected = models.CharField(max_length=100)
    confidence = models.FloatField(null=True, blank=True, help_text="AI detection confidence percentage")
    confidence_score = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.stain_detected} on {self.garment} ({self.user.username})"

class SystemLog(models.Model):
    log_level = models.CharField(max_length=20, default="INFO")
    user = models.CharField(max_length=100, default="System")
    event_action = models.CharField(max_length=255)
    details = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.log_level}] {self.event_action} at {self.timestamp}"

class PasswordResetRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_requests', null=True, blank=True)
    email = models.EmailField()
    token = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"Password reset for {self.email} (Approved: {self.is_approved})"
        
