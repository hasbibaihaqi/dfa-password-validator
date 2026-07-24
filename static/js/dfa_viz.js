/**
 * Merender grafik linear perpindahan state DFA ke dalam kontainer HTML
 * @param {Array} steps - Riwayat (history) transisi dari API
 * @param {boolean} isValid - Status apakah mencapai Accept State
 */
function renderDFAVisualization(steps, isValid) {
    const container = document.getElementById('dfaVisualizer');
    
    if (!steps || steps.length === 0) {
        container.innerHTML = '<span class="dfa-empty-msg"><i class="bi bi-arrow-right-circle me-2"></i>Ketik password untuk memulai simulasi...</span>';
        return;
    }

    let html = `<div class="dfa-track">`;
    
    // Titik Awal (Initial State)
    html += `<div class="dfa-node initial">
                 <i class="bi bi-play-circle-fill me-1" style="opacity:0.5"></i>
                 q_&lt;0,0000&gt;
             </div>`;

    // Looping melalui setiap karakter yang dibaca mesin
    steps.forEach((step, index) => {
        // Tanda panah transisi (Transition Function \delta)
        let displayChar = step.char === ' ' ? 'SPC' : step.char;
        
        let arrowDelay = index * 0.05 + 0.1;
        let nodeDelay = index * 0.05 + 0.15;
        
        html += `<div class="dfa-arrow fade-in" style="animation-delay: ${arrowDelay}s">
                    <span class="char-label">${displayChar}</span>
                    <i class="bi bi-arrow-right arrow-icon"></i>
                 </div>`;
        
        // State Tujuan (Next State)
        let nodeType = "normal";
        let icon = "";
        
        if (step.to_state === "q_trap") {
            nodeType = "trap";
            icon = `<i class="bi bi-exclamation-triangle-fill me-1"></i>`;
        }
        
        // Mengganti kurung sudut agar aman ditampilkan di HTML
        let safeStateName = step.to_state.replace('<', '&lt;').replace('>', '&gt;');
        
        html += `<div class="dfa-node ${nodeType}" style="animation-delay: ${nodeDelay}s">
                    ${icon} ${safeStateName}
                 </div>`;
    });

    // Kesimpulan Akhir (Accept/Reject)
    let finalDelay = steps.length * 0.05 + 0.2;
    html += `<div class="dfa-arrow fade-in" style="animation-delay: ${finalDelay}s; margin: 0 0.5rem;">
                <i class="bi bi-caret-right-fill arrow-icon" style="font-size: 1rem;"></i>
             </div>`;
             
    if (isValid) {
        html += `<div class="dfa-node accept" style="animation-delay: ${finalDelay + 0.1}s; padding: 0.5rem 1rem; font-size:0.8rem;">
                    <i class="bi bi-shield-check me-2" style="font-size: 1.1rem;"></i>
                    ACCEPT
                 </div>`;
    } else {
        html += `<div class="dfa-node reject" style="animation-delay: ${finalDelay + 0.1}s; padding: 0.5rem 1rem; font-size:0.8rem;">
                    <i class="bi bi-shield-x me-2" style="font-size: 1.1rem;"></i>
                    REJECT
                 </div>`;
    }
    
    html += `</div>`;
    container.innerHTML = html;
    
    // Auto-scroll ke paling kanan dengan smooth behavior
    setTimeout(() => {
        container.scrollTo({
            left: container.scrollWidth,
            behavior: 'smooth'
        });
    }, 100);
}