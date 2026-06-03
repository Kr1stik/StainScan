from django.apps import AppConfig

def run_system_setup(sender, **kwargs):
    import os
    try:
        from django.contrib.auth import get_user_model
        from StainApp.models import Scan
        from django.core.management import call_command

        User = get_user_model()

        # 1. Setup Admin Account
        admin_username = 'admin1'
        if not User.objects.filter(username=admin_username).exists():
            print(f"🚀 Live System Setup: Generating admin account '{admin_username}'...")
            User.objects.create_superuser(
                username=admin_username,
                email='admin@stainscan.com',
                password='admin123'
            )

        # 2. Setup Seed Data Migration
        if not Scan.objects.exists():
            print("📦 Live System Setup: Cloud database empty. Seeding local history...")
            fixture_path = os.path.join(os.path.dirname(__file__), '..', 'local_data.json')
            if os.path.exists(fixture_path):
                import json
                with open(fixture_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Grab the admin user we just verified/created above
                admin_user = User.objects.get(username=admin_username)
                scans_to_create = []
                
                for item in data:
                    # Only pull items belonging to your Scan model structure
                    if item.get('model') == 'StainApp.scan':
                        fields = item.get('fields', {})
                        
                        # Dynamically bypass the missing user row block by linking the scan to admin1
                        scans_to_create.append(Scan(
                            user=admin_user,
                            garment=fields.get('garment', 'Mobile Scan'),
                            stain_detected=fields.get('stain_detected', 'Unknown'),
                            confidence=fields.get('confidence'),
                            confidence_score=fields.get('confidence_score', 0),
                            is_approved=fields.get('is_approved', True),
                            date=fields.get('date') # Keeps original historical timestamps
                        ))
                
                if scans_to_create:
                    Scan.objects.bulk_create(scans_to_create)
                    print(f"✅ Cloud database seeded successfully with {len(scans_to_create)} records!")
            else:
                print("⚠️ Seed skipped: local_data.json not found.")

    except Exception as e:
        print(f"⚠️ Initialization block skipped: {e}")

class StainappConfig(AppConfig):
    name = 'StainApp'

    def ready(self):
        import os
        # Stop double execution in development reloads
        if os.environ.get('RUN_MAIN') == 'true' or os.environ.get('RENDERING') == 'true':
            return

        from django.db.models.signals import post_migrate
        
        # Connect our custom setup handler to run immediately after migrations finish
        post_migrate.connect(run_system_setup, sender=self)
