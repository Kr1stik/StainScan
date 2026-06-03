from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Auth & Tokens
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/request-password-reset/', views.request_password_reset, name='request_password_reset'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Mobile secure upload
    path('mobile/upload/', views.mobile_scan_upload, name='mobile_scan_upload'),

    # Analytics
    path('analytics/growth/', views.GrowthAnalyticsView.as_view(), name='growth_analytics'),

    # Core Dashboard Routes
    path('admin/dashboard/', views.AdminDashboardStatsView.as_view(), name='dashboard_stats'),
    path('admin/history/', views.HistoryListView.as_view(), name='history_list'),
    path('admin/history-list/', views.HistoryListView.as_view(), name='history_list_alias'),
    path('admin/recent-activity/', views.RecentActivityView.as_view(), name='recent_activity'),
    path('admin/system-logs/', views.SystemLogsListView.as_view(), name='system_logs_list'),

    # Admin Users
    path('admin/users/', views.admin_users_list, name='admin_users'),
    path('admin/users/archived/', views.ArchivedUserListView.as_view(), name='archived_users'),
    path('admin/users/<int:user_id>/toggle-status/', views.UserStatusToggleView.as_view(), name='user_toggle_status'),
    path('admin/users/<int:user_id>/purge/', views.UserPermanentDeleteView.as_view(), name='user_purge'),

    # Scans
    path('stains/', views.scan_list_create, name='scan_list_create'),
    path('scans/', views.scan_list_create, name='scan_list_alias'),

    # Password Reset Requests
    path('password-reset-requests/', views.password_reset_requests_list, name='password_reset_requests_list'),
    path('password-reset-requests/<int:request_id>/approve/', views.password_reset_request_approve, name='password_reset_request_approve'),
    path('password-reset-requests/<int:request_id>/', views.password_reset_request_reject, name='password_reset_request_reject'),
]
