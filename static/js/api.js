const API_BASE_URL = '/api';

/**
 * Mengirim password ke Backend untuk diproses oleh Mesin DFA
 * @param {string} password - Teks password dari input pengguna
 * @returns {Promise<Object>} - Mengembalikan objek JSON berisi hasil DFA
 */
async function validatePasswordAPI(password) {
    try {
        const response = await fetch(`${API_BASE_URL}/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password })
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
        
    } catch (error) {
        console.error('Error saat memvalidasi password:', error);
        return null;
    }
}