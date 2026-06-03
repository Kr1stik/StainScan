from django.apps import AppConfig

def run_system_setup(sender, **kwargs):
    import os
    try:
        from django.contrib.auth import get_user_model
        from StainApp.models import Scan
        from django.core.management import call_command

        # TEMPORARY CLEANUP LINE: Un-comment this line once to completely clear out the bad 2026 scan entries
        Scan.objects.all().delete()

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
                        
                        # Create the scan instance model instance object template
                        scan_instance = Scan(
                            user=admin_user,
                            garment=fields.get('garment', 'Mobile Scan'),
                            stain_detected=fields.get('stain_detected', 'Unknown'),
                            confidence=fields.get('confidence'),
                            confidence_score=fields.get('confidence_score', 0),
                            is_approved=fields.get('is_approved', True)
                        )
                        
                        # Explicitly prepare the historical date overwrite
                        historical_date = fields.get('date')
                        if historical_date:
                            scan_instance.date = historical_date
                        
                        scans_to_create.append(scan_instance)
                
                if scans_to_create:
                    # Using individual saves followed by forced updates allows bypassing auto_now_add locks
                    for scan in scans_to_create:
                        scan.save()
                        if scan.date:
                            # Double force the database column value to match the exact string timestamp
                            Scan.objects.filter(id=scan.id).update(date=scan.date)
                            
                    print(f"✅ Cloud database seeded successfully with {len(scans_to_create)} historical records!")
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
