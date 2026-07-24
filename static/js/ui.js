// --- Fungsi Update Strength Meter ---
function updateStrengthMeter(strength) {
    const strengthText = document.getElementById('strengthText');
    const strengthBar = document.getElementById('strengthBar');

    let color = 'rgba(255, 255, 255, 0.4)';
    let bgDim = 'rgba(255, 255, 255, 0.1)';
    let width = '0%';

    // Menentukan warna dan lebar berdasarkan level
    switch (strength) {
        case 'Very Weak': 
            color = 'var(--clr-danger)'; 
            bgDim = 'var(--clr-danger-dim)';
            width = '20%'; 
            break;
        case 'Weak': 
            color = 'var(--clr-warning)'; 
            bgDim = 'var(--clr-warning-dim)';
            width = '40%'; 
            break;
        case 'Medium': 
            color = 'var(--clr-primary)'; 
            bgDim = 'var(--clr-primary-dim)';
            width = '60%'; 
            break;
        case 'Strong': 
            color = 'var(--clr-info)'; 
            bgDim = 'var(--clr-info-dim)';
            width = '80%'; 
            break;
        case 'Very Strong': 
            color = 'var(--clr-success)'; 
            bgDim = 'var(--clr-success-dim)';
            width = '100%'; 
            break;
        case 'Rejected': 
            color = '#9ca3af'; 
            bgDim = 'rgba(156, 163, 175, 0.15)';
            width = '100%'; 
            break;
    }

    // Animasi perubahan teks & warna
    strengthText.style.opacity = 0;
    setTimeout(() => {
        strengthText.innerText = strength;
        strengthText.style.color = color;
        strengthText.style.backgroundColor = bgDim;
        strengthText.style.border = `1px solid ${color}`;
        strengthText.style.boxShadow = `0 0 10px ${bgDim}`;
        strengthText.style.opacity = 1;
    }, 150);

    // Animasi Bar
    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
    strengthBar.style.boxShadow = `0 0 15px ${color}`;
}

// --- Fungsi Update Checklist Syarat ---
function updateChecklist(checklist) {
    const updateItem = (id, condition) => {
        const el = document.getElementById(id);
        const originalText = el.innerText.trim();
        
        if (condition) {
            el.className = 'rule-pass';
            el.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ${originalText}`;
        } else {
            el.className = 'rule-fail';
            el.innerHTML = `<i class="bi bi-x-circle-fill me-2"></i> ${originalText}`;
        }
    };

    updateItem('rule-len', checklist.min_length && checklist.max_length);
    updateItem('rule-low', checklist.has_lower);
    updateItem('rule-up', checklist.has_upper);
    updateItem('rule-num', checklist.has_digit);
    updateItem('rule-spc', checklist.has_special);
    updateItem('rule-ws', checklist.no_space);
}

// --- Fungsi Update Tabel Log Simulasi ---
function updateSimulationLog(steps) {
    const tbody = document.getElementById('simulationLog');
    
    if (!steps || steps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-secondary" style="font-family:var(--font-mono); font-size:0.8rem;">Menunggu input...</td></tr>';
        return;
    }

    let html = '';
    steps.forEach((step, index) => {
        let safeFrom = step.from_state.replace('<', '&lt;').replace('>', '&gt;');
        let safeTo = step.to_state.replace('<', '&lt;').replace('>', '&gt;');
        let displayChar = step.char === ' ' ? 'SPC' : step.char;
        let rowClass = step.to_state === 'q_trap' ? 'row-trap' : '';
        
        // Animasi delay untuk tiap baris agar terlihat seperti sedang diketik
        let delay = index * 0.05;
        
        // Notasi Matematis Transisi
        let delta = `δ(${safeFrom}, '${displayChar}') = ${safeTo}`;
        
        html += `<tr class="${rowClass} fade-in" style="animation-delay: ${delay}s">
                    <td><strong style="color:var(--clr-primary)">${displayChar}</strong></td>
                    <td>${safeFrom}</td>
                    <td><code>${delta}</code></td>
                    <td>${safeTo}</td>
                 </tr>`;
    });
    tbody.innerHTML = html;
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
        bg.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(0, 212, 255, 0.04) 0%, transparent 40%)`;
    });
}

// --- Event Listener Utama ---
document.addEventListener('DOMContentLoaded', () => {
    initInteractiveParticles();
    const passwordInput = document.getElementById('passwordInput');
    
    // Set status default untuk rules checklist agar UI sesuai class CSS baru
    const ruleElements = document.querySelectorAll('.rules-list li');
    ruleElements.forEach(el => {
        el.className = 'rule-fail';
        el.innerHTML = `<i class="bi bi-x-circle-fill me-2"></i> ${el.innerText.trim()}`;
    });
    // Khusus tanpa spasi (default true saat kosong)
    const ruleWs = document.getElementById('rule-ws');
    ruleWs.className = 'rule-pass';
    ruleWs.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> Tanpa Spasi`;
    
    // Terpicu setiap kali pengguna mengetik di kolom password
    passwordInput.addEventListener('input', async (e) => {
        const password = e.target.value;
        
        // Jika input dikosongkan, kembalikan UI ke wujud default
        if (password.length === 0) {
            document.getElementById('dfaVisualizer').innerHTML = '<span class="dfa-empty-msg"><i class="bi bi-arrow-right-circle me-2"></i>Ketik password untuk memulai simulasi...</span>';
            document.getElementById('simulationLog').innerHTML = '<tr><td colspan="4" class="text-secondary" style="font-family:var(--font-mono); font-size:0.8rem;">Menunggu input...</td></tr>';
            updateStrengthMeter('Unknown');
            updateChecklist({
                min_length: false, max_length: true, has_lower: false,
                has_upper: false, has_digit: false, has_special: false, no_space: true
            });
            return;
        }

        // Panggil Backend API dan perbarui seluruh UI
        const result = await validatePasswordAPI(password);
        if (result) {
            updateChecklist(result.checklist);
            updateStrengthMeter(result.strength);
            
            // Animasi transisi visual DFA & log (memberikan efek simulasi waktu nyata)
            renderDFAVisualization(result.steps, result.is_valid);
            updateSimulationLog(result.steps);
        }
    });

    // Fitur Show/Hide Password
    const toggleBtn = document.getElementById('togglePassword');
    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash" style="color:var(--clr-primary)"></i>';
        
        // Animasi klik icon
        this.style.transform = 'scale(0.8)';
        setTimeout(() => this.style.transform = 'scale(1)', 150);
    });
});