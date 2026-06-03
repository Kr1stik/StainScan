import os
import sys
import django
from django.urls import resolve, Resolver404

# Ensure project root is on path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'StainScan.settings')
django.setup()

paths_to_test = [
    '/api/admin/dashboard/',
    '/api/admin/recent-activity/',
    '/api/analytics/growth/',
    '/api/admin/history/',
    '/api/admin/system-logs/',
]

print("--- URL RESOLVER TEST ---")
for path in paths_to_test:
    try:
        match = resolve(path)
        print(f"PATH: {path} -> MATCH: {match.url_name} in {match.app_name or 'root'}")
    except Resolver404:
        print(f"PATH: {path} -> 404 NOT FOUND")
    except Exception as e:
        print(f"PATH: {path} -> ERROR: {str(e)}")
