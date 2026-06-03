import os
import sys
import django
from django.db.models.functions import TruncMonth
from django.db.models import Count

# Ensure project root is on path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'StainScan.settings')
django.setup()

from StainApp.models import Scan
from django.contrib.auth.models import User

print("--- DEEP STATISTICAL AUDIT ---")

# 1. Check Year Distribution
print("\n[1] Scan Year Distribution (Raw SQL Extract):")
for y in [2024, 2025, 2026]:
    count = Scan.objects.filter(date__year=y).count()
    print(f"Year {y}: {count} scans")

# 2. Check User Registration vs Activity
print("\n[2] User joined years vs Scan activity:")
for y in [2024, 2025, 2026]:
    joined = User.objects.filter(date_joined__year=y).count()
    active_users = Scan.objects.filter(date__year=y).values('user').distinct().count()
    print(f"Year {y}: {joined} users joined, but {active_users} unique users performed scans.")

# 3. Micro-check 2026 data
print("\n[3] 2026 Scan Sample (Last 5):")
scans_2026 = Scan.objects.filter(date__year=2026).order_by('-date')[:5]
for s in scans_2026:
    print(f"- ID: {s.id}, Date: {s.date}, Stain: '{s.stain_detected}', User Joined: {s.user.date_joined}")

# 4. TruncMonth behavior check
print("\n[4] TruncMonth Aggregation for 2026:")
monthly = (
    Scan.objects.filter(date__year=2026)
    .annotate(month_trunc=TruncMonth('date'))
    .values('month_trunc')
    .annotate(total=Count('id'))
    .order_by('month_trunc')
)
for m in monthly:
    print(f"- Month: {m['month_trunc']}, Count: {m['total']}")

# 5. Check for "Stray" Stains
print("\n[5] Stains EXCLUDED by ['Ballpen Ink', 'Mud', 'Cooking Oil'] in 2026:")
excluded = Scan.objects.filter(date__year=2026).exclude(stain_detected__in=['Ballpen Ink', 'Mud', 'Cooking Oil'])
for s in excluded:
    print(f"- '{s.stain_detected}' (ID: {s.id})")
