import os
import sys
import django

# Ensure project root is on path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'StainScan.settings')
django.setup()

from StainApp.models import Scan
from django.db.models import Count

print("--- AUDIT REPORT ---")
print(f"Total Scans: {Scan.objects.count()}")

print("\nStain Names in DB:")
stains = Scan.objects.values('stain_detected').annotate(count=Count('id'))
for s in stains:
    print(f"- '{s['stain_detected']}': {s['count']}")

print("\nYears in DB:")
years = Scan.objects.values('date__year').annotate(count=Count('id'))
for y in years:
    print(f"- {y['date__year']}: {y['count']}")

print("\nScans that would be CAUGHT by current filter ['Ballpen Ink', 'Mud', 'Used Cooking Oil'] in 2026:")
caught = Scan.objects.filter(
    date__year=2026,
    stain_detected__in=['Ballpen Ink', 'Mud', 'Used Cooking Oil']
).count()
print(f"Count: {caught}")
