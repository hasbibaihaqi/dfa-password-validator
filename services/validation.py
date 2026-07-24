def mask_password(password):
    """
    Menyamarkan password untuk disimpan ke database.
    Hanya menyisakan 1 karakter pertama dan 1 karakter terakhir.
    Contoh: 'Secret123!' -> 'S********!'
    """
    length = len(password)
    if length <= 2:
        return '*' * length
    
    # Karakter pertama + Bintang sebanyak sisa tengah + Karakter terakhir
    masked_middle = '*' * (length - 2)
    return f"{password[0]}{masked_middle}{password[-1]}"