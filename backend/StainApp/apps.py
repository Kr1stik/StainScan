from django.apps import AppConfig


class StainappConfig(AppConfig):
    name = 'StainApp'

    def ready(self):
        # Prevent double execution during local reloads
        import os
        if os.environ.get('RUN_MAIN') == 'true' or os.environ.get('RENDERING') == 'true':
            return

        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            admin_username = 'admin1'
            admin_password = 'admin123'
            admin_email = 'admin@stainscan.com'

            if not User.objects.filter(username=admin_username).exists():
                print(f"🚀 Creating cloud admin: {admin_username}...")
                User.objects.create_superuser(
                    username=admin_username,
                    email=admin_email,
                    password=admin_password
                )
                print("✅ Cloud admin created successfully!")
        except Exception as e:
            print(f"⚠️ Initialization skipped: {e}")
