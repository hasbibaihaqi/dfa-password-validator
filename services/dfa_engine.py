class PasswordDFA:
    """
    Kelas ini merupakan representasi dari mesin Deterministic Finite Automata (DFA)
    untuk validasi password.
    
    State direpresentasikan dengan format: q_<n, L, U, D, S>
    n = jumlah karakter
    L, U, D, S = boolean (0 atau 1) untuk Lowercase, Uppercase, Digit, Special
    """
    
    def __init__(self):
        # Initial State: q_<0, 0, 0, 0, 0>
        self.n = 0
        self.l = 0
        self.u = 0
        self.d = 0
        self.s = 0
        self.is_trap = False
        
    def _get_state_name(self):
        """Mengembalikan nama state matematis saat ini."""
        if self.is_trap:
            return "q_trap"
        return f"q_<{self.n},{self.l}{self.u}{self.d}{self.s}>"

    def _get_input_symbol(self, char):
        """
        Fungsi untuk mengklasifikasikan karakter input ke dalam himpunan alfabet Sigma (Σ).
        Tanpa menggunakan Regex, murni menggunakan metode string bawaan.
        """
        if char.isspace():
            return 'w' # Whitespace (Spasi)
        elif char.islower():
            return 'l' # Lowercase
        elif char.isupper():
            return 'u' # Uppercase
        elif char.isdigit():
            return 'd' # Digit (Angka)
        else:
            return 's' # Special (Selain dari di atas dianggap karakter spesial)

    def process(self, password):
        """
        Menjalankan string password ke dalam mesin DFA dan 
        merekam setiap perpindahan state-nya.
        """
        history = []
        current_state = self._get_state_name()
        
        # Mesin membaca input karakter demi karakter secara sekuensial
        for char in password:
            from_state = current_state
            symbol = self._get_input_symbol(char)
            
            # FUNGSI TRANSISI \delta(q, x)
            if self.is_trap:
                pass # Jika sudah di trap state, mesin terkunci tidak bisa ke mana-mana
            elif symbol == 'w' or self.n >= 32:
                # Transisi ke Reject/Trap state jika ada spasi atau melebihi 32 karakter
                self.is_trap = True
            else:
                # Transisi normal, tambah panjang karakter
                self.n += 1
                if symbol == 'l':
                    self.l = 1
                elif symbol == 'u':
                    self.u = 1
                elif symbol == 'd':
                    self.d = 1
                elif symbol == 's':
                    self.s = 1
            
            # Ambil state baru setelah transisi
            current_state = self._get_state_name()
            
            # Catat rekam jejak untuk divisualisasikan di Frontend
            history.append({
                "char": char,
                "from_state": from_state,
                "to_state": current_state
            })
            
        return self._evaluate_result(history)

    def _evaluate_result(self, history):
        """
        Mengevaluasi hasil akhir (Accept atau Reject) dan 
        menentukan Strength level murni berdasarkan State Akhir DFA.
        """
        rules_passed = self.l + self.u + self.d + self.s
        is_valid = False
        strength = "Very Weak"
        
        # Syarat Accept State: Tidak di trap, panjang minimal 8, dan 4 syarat terpenuhi (1111)
        if not self.is_trap and self.n >= 8 and rules_passed == 4:
            is_valid = True
            if self.n >= 12:
                strength = "Very Strong"
            else:
                strength = "Strong"
        else:
            # Jika tidak valid, tentukan level weakness
            is_valid = False
            if self.is_trap:
                strength = "Rejected"
            elif rules_passed <= 1 or self.n < 8:
                strength = "Very Weak"
            elif rules_passed == 2:
                strength = "Weak"
            elif rules_passed == 3:
                strength = "Medium"

        return {
            "is_valid": is_valid,
            "final_state": self._get_state_name(),
            "strength": strength,
            "rules_passed": rules_passed,
            "length": self.n,
            "checklist": {
                "min_length": self.n >= 8,
                "max_length": self.n <= 32 and not self.is_trap,
                "has_lower": bool(self.l),
                "has_upper": bool(self.u),
                "has_digit": bool(self.d),
                "has_special": bool(self.s),
                "no_space": not self.is_trap # Jika kena trap karena spasi, ini jadi false
            },
            "steps": history
        }