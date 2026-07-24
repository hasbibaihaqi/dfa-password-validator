const API_BASE_URL = '/api';

/**
 * Animasi penghitungan angka (Count Up)
 */
function animateValue(obj, start, end, duration) {
    if (start === end) {
        obj.innerHTML = end;
        return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end; // Ensure exact final value
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * Mengambil data statistik agregat dari Backend
 */
async function fetchStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics`);
        if (!response.ok) throw new Error('Gagal mengambil statistik');
        
        const data = await response.json();
        
        const totalEl = document.getElementById('statTotal');
        const validEl = document.getElementById('statValid');
        const invalidEl = document.getElementById('statInvalid');
        
        // Animasi angka
        animateValue(totalEl, 0, data.total_tested, 1000);
        animateValue(validEl, 0, data.valid, 1000);
        animateValue(invalidEl, 0, data.invalid, 1000);
        
        const strengthEl = document.getElementById('statStrength');
        strengthEl.innerText = data.most_common_strength;
        
        // Mewarnai teks strength sesuai levelnya menggunakan variabel warna CSS baru
        let color = 'var(--text-secondary)';
        switch (data.most_common_strength) {
            case 'Very Weak': color = 'var(--clr-danger)'; break;
            case 'Weak': color = 'var(--clr-warning)'; break;
            case 'Medium': color = 'var(--clr-primary)'; break;
            case 'Strong': color = 'var(--clr-info)'; break;
            case 'Very Strong': color = 'var(--clr-success)'; break;
        }
        strengthEl.style.color = color;

    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

/**
 * Mengambil data riwayat terbaru dari Backend
 */
async function fetchHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/history`);
        if (!response.ok) throw new Error('Gagal mengambil riwayat');
        
        const histories = await response.json();
        const tbody = document.getElementById('historyTableBody');
        
        if (histories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:rgba(255,255,255,0.3); font-family:var(--font-mono); font-size:0.8rem;"><i class="bi bi-inbox me-2"></i>Belum ada riwayat validasi.</td></tr>';
            return;
        }

        let html = '';
        histories.forEach((item, index) => {
            let statusBadge = item.is_valid 
                ? '<span class="badge-accept"><i class="bi bi-check-circle-fill"></i> Accept</span>'
                : '<span class="badge-reject"><i class="bi bi-x-circle-fill"></i> Reject</span>';
            
            // Mengamankan penulisan bracket state untuk HTML
            let safeState = item.final_state.replace('<', '&lt;').replace('>', '&gt;');
            
            let rowClass = item.final_state === 'q_trap' ? 'row-trap' : '';
            let delay = index * 0.08;

            html += `<tr class="${rowClass} fade-in" style="animation-delay: ${delay}s">
                        <td style="color:rgba(255,255,255,0.4); font-size:0.75rem;">${item.created_at}</td>
                        <td style="font-weight:600; color:var(--clr-primary); letter-spacing:0.1em;">${item.masked_password}</td>
                        <td>${statusBadge}</td>
                        <td style="font-weight:700;">${item.strength}</td>
                        <td><code>${safeState}</code></td>
                     </tr>`;
        });
        
        tbody.innerHTML = html;

    } catch (error) {
        console.error('Error fetching history:', error);
        document.getElementById('historyTableBody').innerHTML = 
            '<tr><td colspan="5" style="text-align:center; color:var(--clr-danger);"><i class="bi bi-exclamation-triangle me-2"></i>Gagal memuat data riwayat.</td></tr>';
    }
}

// --- Animasi Latar Belakang (Interactive Particles) ---
function initInteractiveParticles() {
    const bg = document.createElement('div');
    bg.style.position = 'fixed';
    bg.style.top = '0';
    bg.style.left = '0';
    bg.style.width = '100%';
    bg.style.height = '100%';
    bg.style.pointerEvents = 'none';
    bg.style.zIndex = '-1';
    document.body.appendChild(bg);
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        bg.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(167, 139, 250, 0.04) 0%, transparent 40%)`;
    });
}

// Menjalankan fungsi pengambilan data saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    initInteractiveParticles();
    fetchStatistics();
    fetchHistory();
});