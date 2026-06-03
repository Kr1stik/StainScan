import os
import sys
import django

# Ensure project root is on path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'StainScan.settings')
django.setup()

from StainApp.models import Scan

def normalize_stain_name(name):
    """Normalize stain names to consolidate duplicates"""
    if not name:
        return "Unknown"
    name = name.strip().lower()
    if "ballp" in name and "ink" in name:
        return "Ballpen Ink"
    if "cooking" in name and "oil" in name:
        return "Cooking Oil"
    return name.title()

print("--- RETROACTIVE NORMALIZATION ---")
scans = Scan.objects.all()
updated_count = 0

for scan in scans:
    original = scan.stain_detected
    normalized = normalize_stain_name(original)
    if original != normalized:
        scan.stain_detected = normalized
        scan.save()
        updated_count += 1
        print(f"Updated: '{original}' -> '{normalized}'")

print(f"\nTotal scans updated: {updated_count}")
