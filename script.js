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
        const section = document.createElement('div');
        section.className = 'zona-container';

        // Guía de la zona
        const guiaHtml = zona.guia.map(item => `<li>${item}</li>`).join('');

        // Filas de Pokémon
        const filasHtml = zona.pokemons.map(p => {
            const isCaptured = localStorage.getItem(p.id) === 'true';
            const evolTexto = p.evol ? `<span class="evol-text">(${p.evol})</span>` : '';
            
            return `
                <tr id="row-${p.id}" class="${isCaptured ? 'is-captured' : ''}">
                    <td><strong>${p.nombre}</strong>${evolTexto}</td>
                    <td><span class="tipo-badge tipo-${p.tipo}">${p.tipo.substring(0,3)}</span></td>
                    <td>${p.captura}</td>
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
    });
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
