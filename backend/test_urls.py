import os
import sys
import django
from django.test import Client

# Ensure project root is on path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'StainScan.settings')
django.setup()

client = Client()

urls_to_test = [
    '/api/admin/history/?year=2026',
    '/api/admin/history/?year=2025',
    '/api/admin/dashboard/?year=2026',
    '/api/analytics/growth/?year=2026',
]

print("--- URL RESOLUTION TEST ---")
for url in urls_to_test:
    response = client.get(url)
    print(f"GET {url} -> Status Code: {response.status_code}")
    if response.status_code == 404:
        # Check if it works without trailing slash or with different prefix
        alt_url = url.replace('/?', '?')
        response_alt = client.get(alt_url)
        print(f"  Alt GET {alt_url} -> Status Code: {response_alt.status_code}")
