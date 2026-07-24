from flask import Blueprint, request, jsonify
from models.history import db, PasswordHistory
from services.dfa_engine import PasswordDFA
from services.validation import mask_password

# Membuat blueprint untuk routing API
api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/validate', methods=['POST'])
def validate_password():
    """
    Endpoint utama untuk menerima teks password, menjalankan mesin DFA,
    dan menyimpan hasilnya ke dalam database.
    """
    data = request.get_json()
    
    # Validasi input kosong
    if not data or 'password' not in data:
        return jsonify({"error": "Password tidak boleh kosong"}), 400
        
    password = data['password']
    
    # 1. Inisialisasi dan jalankan Mesin DFA
    dfa = PasswordDFA()
    result = dfa.process(password)
    
    # 2. Samarkan password untuk disimpan (Keamanan)
    masked_pw = mask_password(password)
    
    # 3. Simpan ke Database
    new_history = PasswordHistory(
        masked_password=masked_pw,
        is_valid=result['is_valid'],
        strength=result['strength'],
        rules_passed=result['rules_passed'],
        final_state=result['final_state']
    )
    db.session.add(new_history)
    db.session.commit()
    
    # 4. Kembalikan hasil mesin DFA ke Frontend untuk visualisasi
    return jsonify(result), 200

@api_bp.route('/history', methods=['GET'])
def get_history():
    """Mengambil riwayat validasi terbaru dari database."""
    # Mengambil 20 data terbaru
    histories = PasswordHistory.query.order_by(PasswordHistory.created_at.desc()).limit(20).all()
    return jsonify([h.to_dict() for h in histories]), 200

@api_bp.route('/statistics', methods=['GET'])
def get_statistics():
    """Menghitung agregasi data untuk Dashboard."""
    total = PasswordHistory.query.count()
    valid_count = PasswordHistory.query.filter_by(is_valid=True).count()
    invalid_count = total - valid_count
    
    # Mencari kekuatan (strength) yang paling sering muncul
    # (Hanya jika ada data di database)
    most_common_strength = "-"
    if total > 0:
        strength_counts = db.session.query(
            PasswordHistory.strength, db.func.count(PasswordHistory.strength).label('total')
        ).group_by(PasswordHistory.strength).order_by(db.text('total DESC')).first()
        
        if strength_counts:
            most_common_strength = strength_counts[0]

    return jsonify({
        "total_tested": total,
        "valid": valid_count,
        "invalid": invalid_count,
        "most_common_strength": most_common_strength
    }), 200

@api_bp.route('/history', methods=['DELETE'])
def clear_history():
    """Endpoint utilitas untuk membersihkan seluruh riwayat (opsional)."""
    try:
        db.session.query(PasswordHistory).delete()
        db.session.commit()
        return jsonify({"message": "Riwayat berhasil dihapus"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500