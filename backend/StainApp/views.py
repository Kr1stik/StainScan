from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer, ScanSerializer, SystemLogSerializer, RegisterSerializer, LoginSerializer, PasswordResetRequestSerializer
from .models import Scan, SystemLog, PasswordResetRequest
from django.db.models import Count
from rest_framework.views import APIView
from django.db.models.functions import TruncMonth
import calendar
import datetime
from django.utils import timezone
from django.http import HttpResponse

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'message': 'User registered successfully',
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'message': 'Registration failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invalid username or password.'
            }, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({
                'success': False,
                'message': 'Invalid username or password.'
            }, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({
                'success': False,
                'message': 'User account is inactive.'
            }, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'message': 'Login successful',
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'tier': 'free',
            'registration_year': user.date_joined.year,
            'id': str(user.id),
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)
    return Response({
        'success': False,
        'message': 'Login failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def request_password_reset(request):
    email = request.data.get('email', '').strip()

    if not email:
        return Response({
            'success': False,
            'message': 'Email address is required'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({
            'success': True,
            'message': 'If an account exists with this email, you will receive a password reset link'
        }, status=status.HTTP_200_OK)

    reset_request = PasswordResetRequest.objects.create(
        user=user,
        email=email
    )

    return Response({
        'success': True,
        'message': 'Password reset link sent. Admin approval is required.'
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def mobile_scan_upload(request):
    """
    Secure endpoint for mobile app to upload scans.
    Requires JWT token and automatically associates scan with the authenticated user.
    """
    try:
        user = request.user
        garment = request.data.get('garment') or 'Unknown'
        stain_detected = request.data.get('stain_detected') or 'Unknown'
        confidence_score = request.data.get('confidence_score') or 0
        
        # Create the Scan record linked to the auth user
        scan = Scan.objects.create(
            user=user,
            garment=garment,
            stain_detected=normalize_stain_name(stain_detected),
            confidence_score=confidence_score
        )

        # SUCCESS STATE LOG (INFO)
        SystemLog.objects.create(
            log_level="INFO",
            user=str(request.user if request.user.is_authenticated else "Mobile_User"),
            event_action="Scan Processing Succeeded",
            details=f"Successfully analyzed {request.data.get('garment', 'Fabric')} via mobile API. Detected: {stain_detected} ({confidence_score}% Confidence)."
        )

        # LOW CONFIDENCE WARNING LOG (WARNING)
        if confidence_score < 75:
            SystemLog.objects.create(
                log_level="WARNING",
                user=str(request.user if request.user.is_authenticated else "Mobile_User"),
                event_action="Low Confidence Detection",
                details=f"Scan processed successfully, but the model recorded a low threshold profile: {confidence_score}% score on {stain_detected}."
            )
        
        serializer = ScanSerializer(scan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        # SYSTEM CRASH LOG (ERROR)
        SystemLog.objects.create(
            log_level="ERROR",
            user=str(request.user if request.user.is_authenticated else "System_Gateway"),
            event_action="Mobile Upload Terminated",
            details=f"Fatal Exception caught during pipeline execution: {str(e)}"
        )
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SystemLogsListView(APIView):
    """
    Returns a collection of system audit logs, ordered by newest first.
    """
    def get(self, request):
        logs = SystemLog.objects.all().order_by('-timestamp')
        serializer = SystemLogSerializer(logs, many=True)
        return Response(serializer.data)




@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def scan_list_create(request):
    """
    List all scans or create a new scan result.
    Requires JWT authentication - uses authenticated user's account.
    """
    if request.method == 'GET':
        scans = Scan.objects.all().order_by('-date')
        serializer = ScanSerializer(scans, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Use authenticated user from JWT token
        user = request.user

        # Extract data from mobile app or web frontend
        garment = request.data.get('garment') or request.data.get('type') or 'Unknown'
        stain_detected = (
            request.data.get('stainDetected')
            or request.data.get('name')
            or request.data.get('type')
            or 'Unknown'
        )

        confidence_score = 0
        raw_score = request.data.get('confidenceScore')
        raw_confidence = request.data.get('confidence')
        if raw_score is not None:
            try:
                confidence_score = int(float(raw_score))
            except (TypeError, ValueError):
                confidence_score = 0
        elif raw_confidence is not None:
            try:
                confidence_score = int(float(raw_confidence) * 100)
            except (TypeError, ValueError):
                confidence_score = 0

        confidence = None
        if raw_confidence is not None:
            try:
                confidence = float(raw_confidence)
            except (TypeError, ValueError):
                confidence = None
        elif raw_score is not None:
            try:
                confidence = float(raw_score) / 100.0
            except (TypeError, ValueError):
                confidence = None

        # Create the Scan record with authenticated user
        scan = Scan.objects.create(
            user=user,
            garment=garment,
            stain_detected=normalize_stain_name(stain_detected),
            confidence=confidence,
            confidence_score=confidence_score
        )

        serializer = ScanSerializer(scan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


def normalize_stain_name(name):
    """Normalize stain names to consolidate duplicates"""
    if not name:
        return "Unknown"
    name = name.strip().lower()
    if "ballp" in name and "ink" in name:
        return "Ballpen Ink"
    if "used" in name and "cooking" in name and "oil" in name:
        return "Used Cooking Oil"
    if "cooking" in name and "oil" in name:
        return "Used Cooking Oil"
    return name.title()


class AdminDashboardStatsView(APIView):
    """
    Returns high-level statistics for the admin dashboard, optionally filtered by year.
    Ensures pie/donut chart data (stainGraphData) is accurate.
    """
    def get(self, request):
        year = request.query_params.get('year')
        from django.contrib.auth.models import User

        # User filtering
        user_queryset = User.objects.all()
        if year and year != 'undefined':
            user_queryset = user_queryset.filter(date_joined__year=int(year))
        total_users = user_queryset.count()

        # Target scoped stains for accuracy
        target_stains = ['Ballpen Ink', 'Mud', 'Used Cooking Oil']
        scans_queryset = Scan.objects.filter(stain_detected__in=target_stains)
        
        if year and year != 'undefined':
            scans_queryset = scans_queryset.filter(date__year=int(year))
            
        # Total Scans for the card
        total_scans = scans_queryset.count()

        # Consolidate duplicate stain names and ensure all categories exist
        stain_counts_dict = {stain: 0 for stain in target_stains}
        for scan in scans_queryset:
            normalized_name = normalize_stain_name(scan.stain_detected)
            if normalized_name in stain_counts_dict:
                stain_counts_dict[normalized_name] += 1

        # Sort by count for top/least stain
        sorted_stains = sorted(stain_counts_dict.items(), key=lambda x: x[1], reverse=True)
        top_stain = sorted_stains[0][0] if total_scans > 0 else "-"
        least_stain = sorted_stains[-1][0] if total_scans > 0 else "-"

        # Format stain graph data (percentage breakdown) for Pie/Donut chart
        stain_data = []
        for stain_name in target_stains:
            count = stain_counts_dict[stain_name]
            percentage = round((count / total_scans) * 100) if total_scans > 0 else 0
            stain_data.append({
                "name": stain_name,
                "percentage": percentage
            })

        return Response({
            "totalUsers": total_users,
            "totalScans": total_scans,
            "topStain": top_stain,
            "leastStain": least_stain,
            "stainGraphData": stain_data
        })


from django.core.paginator import Paginator

@api_view(['GET'])
def admin_users_list(request):
    """
    Returns a paginated list of all active registered users in the system.
    """
    users_queryset = User.objects.filter(is_active=True).order_by('-date_joined')
    page_number = request.query_params.get('page', 1)
    
    paginator = Paginator(users_queryset, 15) # Max 15 items per page
    page_obj = paginator.get_page(page_number)
    
    serializer = UserSerializer(page_obj, many=True)
    
    return Response({
        'results': serializer.data,
        'total_pages': paginator.num_pages,
        'current_page': int(page_number)
    })


class ArchivedUserListView(APIView):
    """
    Returns a paginated list of all deactivated (archived) users.
    """
    def get(self, request):
        archived_users = User.objects.filter(is_active=False).order_by('-date_joined')
        page_number = request.query_params.get('page', 1)
        
        paginator = Paginator(archived_users, 15)
        page_obj = paginator.get_page(page_number)
        
        serializer = UserSerializer(page_obj, many=True)
        
        return Response({
            'results': serializer.data,
            'total_pages': paginator.num_pages,
            'current_page': int(page_number)
        })


class UserPermanentDeleteView(APIView):
    """
    Permanently deletes a deactivated user account.
    """
    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, is_active=False)
            username = user.username
            user.delete()
            
            # Log the deletion
            SystemLog.objects.create(
                log_level="WARNING",
                user=str(request.user if request.user.is_authenticated else "Admin_User"),
                event_action="User Permanently Deleted",
                details=f"User account {username} (ID: {user_id}) has been permanently purged from the system."
            )
            
            return Response({"status": "success", "message": "Account permanently deleted."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Archived user not found"}, status=status.HTTP_404_NOT_FOUND)


class UserStatusToggleView(APIView):
    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            target_status = request.data.get('status') # Expects 'Active' or 'Deactivated'
            
            if target_status == 'Active':
                user.is_active = True
            elif target_status == 'Deactivated':
                user.is_active = False
            elif 'is_active' in request.data:
                user.is_active = request.data['is_active']
            
            user.save()
            
            # Optional: Log the admin action to your SystemLog model here
            SystemLog.objects.create(
                log_level="INFO",
                user=str(request.user if request.user.is_authenticated else "Admin_User"),
                event_action="User Status Toggled",
                details=f"User {user.username} (ID: {user.id}) status changed to {'Active' if user.is_active else 'Deactivated'}."
            )
            
            return Response({"status": "success", "is_active": user.is_active}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class HistoryListView(APIView):
    """
    Returns a paginated list of scan history from the database.
    Filtered by scoped stains and year.
    """
    def get(self, request):
        year = request.query_params.get('year')
        page_number = request.query_params.get('page', 1)
        
        # Filter scans by scoped stains
        scans_queryset = Scan.objects.filter(
            stain_detected__in=['Ballpen Ink', 'Mud', 'Used Cooking Oil']
        ).order_by('-date')

        if year:
            scans_queryset = scans_queryset.filter(date__year=int(year))

        # Implement Pagination (15 items per page)
        paginator = Paginator(scans_queryset, 15)
        page_obj = paginator.get_page(page_number)
        
        serializer = ScanSerializer(page_obj, many=True)
        
        return Response({
            'results': serializer.data,
            'total_pages': paginator.num_pages,
            'current_page': int(page_number)
        })


class GrowthAnalyticsView(APIView):
    """
    Calculates monthly system growth (scan counts) for a specific year.
    Returns data formatted for Recharts (array of objects).
    """
    def get(self, request):
        year = request.query_params.get('year', 2026)
        
        # Aggregate scans by month for the given year and scoped stains
        monthly_stats = (
            Scan.objects.filter(
                date__year=int(year), 
                stain_detected__in=['Ballpen Ink', 'Mud', 'Used Cooking Oil']
            )
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total=Count('id'))
            .order_by('month')
        )

        # Initialize full year (Jan-Dec) with 0s
        data_map = {m: 0 for m in range(1, 13)}
        for entry in monthly_stats:
            if entry['month']:
                month_idx = entry['month'].month
                data_map[month_idx] = entry['total']

        # Format for Recharts (matches frontend expectations)
        formatted_data = [
            {"month": calendar.month_name[m][:3], "scans": data_map[m]}
            for m in range(1, 13)
        ]
        
        return Response(formatted_data)


class RecentActivityView(APIView):
    """
    Returns the 5 absolute newest scans from the database for real-time tracking.
    Filtered by scoped stains.
    """
    def get(self, request):
        scans = Scan.objects.filter(stain_detected__in=['Ballpen Ink', 'Mud', 'Used Cooking Oil']).order_by('-date')[:5]
        serializer = ScanSerializer(scans, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def password_reset_requests_list(request):
    """
    List all password reset requests ordered by newest first.
    """
    requests = PasswordResetRequest.objects.all().order_by('-created_at')
    serializer = PasswordResetRequestSerializer(requests, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def password_reset_request_approve(request, request_id):
    """
    Approve a password reset request.
    """
    try:
        reset_request = PasswordResetRequest.objects.get(id=request_id)
        reset_request.is_approved = True
        reset_request.save()
        serializer = PasswordResetRequestSerializer(reset_request)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except PasswordResetRequest.DoesNotExist:
        return Response({
            'error': 'Password reset request not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def password_reset_request_reject(request, request_id):
    """
    Reject/delete a password reset request.
    """
    try:
        reset_request = PasswordResetRequest.objects.get(id=request_id)
        reset_request.delete()
        return Response({'message': 'Password reset request rejected'}, status=status.HTTP_204_NO_CONTENT)
    except PasswordResetRequest.DoesNotExist:
        return Response({
            'error': 'Password reset request not found'
        }, status=status.HTTP_404_NOT_FOUND)
