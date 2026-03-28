async function init() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        renderApp(data);
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

function renderApp(zonas) {
    const container = document.getElementById('app');
    container.innerHTML = '';

    zonas.forEach(zona => {
        const tiposHtml = p.tipo.split('/').map(t => {
            const tipoLimpio = t.trim().toLowerCase();
            // Tomamos las 3 primeras letras para el texto del badge (ej: VOL, NOR, VEN)
            const iniciales = tipoLimpio.substring(0, 3).toUpperCase();
            return `<span class="tipo-badge tipo-${tipoLimpio}">${iniciales}</span>`;
        }).join(' ');
        
        return `
            <tr id="row-${p.id}" class="${isCaptured ? 'is-captured' : ''}">
                <td>
                    <strong>${p.nombre}</strong>
                    ${p.evol ? `<span class="evol-text">(${p.evol})</span>` : ''}
                </td>
                <td>${tiposHtml}</td> <td>${p.captura}</td>
                <td><input type="checkbox" id="${p.id}" ${isCaptured ? 'checked' : ''} onchange="toggleCapture('${p.id}')"></td>
            </tr>
            `;
        }).join('');

        section.innerHTML = `
            <div class="zona-header" onclick="toggleZona(this)">
                <span>${zona.nombre}</span>
                <span class="icon">▼</span>
            </div>
            <div class="zona-content">
                <div class="guia-box"><strong>💡 Consejos:</strong><ul>${guiaHtml}</ul></div>
                <table>
                    <thead><tr><th>Nombre</th><th>Tipo</th><th>Captura</th><th>¿Ok?</th></tr></thead>
                    <tbody>${filasHtml}</tbody>
                </table>
            </div>
        `;
        container.appendChild(section);
    }));
}

function toggleZona(el) {
    const content = el.nextElementSibling;
    content.classList.toggle('active');
    el.querySelector('.icon').innerText = content.classList.contains('active') ? '▲' : '▼';
}

function toggleCapture(id) {
    const cb = document.getElementById(id);
    const row = document.getElementById(`row-${id}`);
    localStorage.setItem(id, cb.checked);
    
    if (cb.checked) row.classList.add('is-captured');
    else row.classList.remove('is-captured');
}

init();
