import os
import sys

# Ensure project root is on path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'StainScan.settings')

try:
    import django
    django.setup()
    from StainApp.models import Scan
    print('Django setup OK')
    try:
        cnt = Scan.objects.count()
        print('Scan count:', cnt)
    except Exception as e:
        print('DB QUERY ERROR:', repr(e))
except Exception as e:
    print('DJANGO SETUP ERROR:', repr(e))
