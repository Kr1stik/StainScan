import os
import sys
import django

# Ensure project root is on path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'StainScan.settings')
django.setup()

from StainApp.models import Scan

print("--- STAIN NAME MIGRATION ---")
scans = Scan.objects.filter(stain_detected='Cooking Oil')
count = scans.count()

if count > 0:
    scans.update(stain_detected='Used Cooking Oil')
    print(f"Successfully migrated {count} records from 'Cooking Oil' to 'Used Cooking Oil'.")
else:
    print("No records found with 'Cooking Oil'.")
