from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.views import APIView

class APIRootView(APIView):
    def get(self, request):
        return Response({
            'message': 'StainScan API',
            'version': '1.0.0',
            'endpoints': {
                'admin': '/admin-django/',
                'api': '/api/',
                'login': '/api/login/',
                'dashboard': '/api/admin/dashboard/',
                'recent_activity': '/api/admin/recent-activity/',
                'history': '/api/admin/history/',
                'history_list': '/api/admin/history-list/',
                'growth': '/api/analytics/growth/',
            },
            'web_app': 'http://localhost:3000'
        })

urlpatterns = [
    path('', APIRootView.as_view(), name='api-root'),
    path('admin-django/', admin.site.urls),
    path('api/', include('StainApp.urls')),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]
