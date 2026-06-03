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
                call_command('loaddata', fixture_path)
                print("✅ Cloud database seeded successfully!")
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
