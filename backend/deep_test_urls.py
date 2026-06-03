import os
import sys
import django
from django.test import Client
import json

# Ensure project root is on path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'StainScan.settings')
django.setup()

client = Client()

urls_to_test = [
    '/api/admin/dashboard/',
    '/api/admin/recent-activity/',
    '/api/admin/system-logs/',
]

print("--- DEEP URL TEST ---")
for url in urls_to_test:
    try:
        response = client.get(url)
        print(f"GET {url} -> Status: {response.status_code}")
        if response.status_code != 200:
            print(f"  Error Content: {response.content.decode()[:100]}")
    except Exception as e:
        print(f"GET {url} -> CRASH: {str(e)}")
