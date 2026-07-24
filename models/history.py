from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Inisialisasi instance database
db = SQLAlchemy()

class PasswordHistory(db.Model):
    __tablename__ = 'password_history'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    masked_password = db.Column(db.String(50), nullable=False)
    is_valid = db.Column(db.Boolean, nullable=False)
    strength = db.Column(db.String(20), nullable=False)
    rules_passed = db.Column(db.Integer, nullable=False, default=0)
    final_state = db.Column(db.String(30), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Method bantuan untuk memformat data ke JSON saat merespons API
    def to_dict(self):
        return {
            'id': self.id,
            'masked_password': self.masked_password,
            'is_valid': self.is_valid,
            'strength': self.strength,
            'rules_passed': self.rules_passed,
            'final_state': self.final_state,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }