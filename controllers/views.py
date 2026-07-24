from flask import Blueprint, render_template

# Blueprint untuk halaman antarmuka (UI)
views_bp = Blueprint('views', __name__)

@views_bp.route('/')
def index():
    """Merender halaman utama (Input & Visualisasi DFA)."""
    return render_template('index.html')

@views_bp.route('/dashboard')
def dashboard():
    """Merender halaman Dashboard Statistik."""
    return render_template('dashboard.html')

@views_bp.route('/about')
def about():
    """Merender halaman Tentang DFA."""
    return render_template('about.html')