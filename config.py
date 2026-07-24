import os

# Mendapatkan path direktori utama proyek
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Menentukan lokasi file SQLite di dalam folder 'database'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'database', 'dfa_app.db')
    
    # Menonaktifkan fitur tracking modifikasi agar hemat memori (Clean Code)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Secret key untuk sesi keamanan aplikasi web
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'kunci-rahasia-dfa-otomata-123'