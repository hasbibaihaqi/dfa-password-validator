import os
from flask import Flask
from config import Config
from models.history import db
from flask_migrate import Migrate

# Inisialisasi alat migrasi database
migrate = Migrate()

def create_app():
    # Pastikan folder database ada sebelum aplikasi dijalankan
    if not os.path.exists('database'):
        os.makedirs('database')

    app = Flask(__name__)
    app.config.from_object(Config)

    # Menyambungkan database dan migrate ke aplikasi Flask
    db.init_app(app)
    migrate.init_app(app, db)

    # TAMBAHAN BARU: Otomatis membuat tabel database jika belum ada
    with app.app_context():
        db.create_all()

    # Mendaftarkan Controllers / Blueprints yang sudah dibuat
    from controllers.views import views_bp
    from controllers.api import api_bp
    
    app.register_blueprint(views_bp)
    app.register_blueprint(api_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)