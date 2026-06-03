import os
import sys
import django
from django.urls import get_resolver

# Ensure project root is on path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'StainScan.settings')
django.setup()

def show_urls(url_patterns, prefix=''):
    for pattern in url_patterns:
        if hasattr(pattern, 'url_patterns'):
            show_urls(pattern.url_patterns, prefix + str(pattern.pattern))
        else:
            print(f"{prefix}{str(pattern.pattern)}")

print("--- REGISTERED URLS ---")
show_urls(get_resolver().url_patterns)
