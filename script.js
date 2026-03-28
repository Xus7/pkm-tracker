async function init() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error("No se pudo cargar el archivo data.json");
        const data = await response.json();
        renderApp(data);
    } catch (error) {
        console.error("Error cargando datos:", error);
        document.getElementById('app').innerHTML = `<div style="padding:20px; color:red;">Error al cargar los datos. Revisa el archivo data.json.</div>`;
    }
}

function renderApp(zonas) {
    const container = document.getElementById('app');
    container.innerHTML = '';

    zonas.forEach(zona => {
        const section = document.createElement('div');
        section.className = 'zona-container';

        // Procesar los Pokémon de la zona
        const filasHtml = zona.pokemons.map(p => {
            const isCaptured = localStorage.getItem(p.id) === 'true';
            
            // Lógica para los tipos (soporta uno o varios separados por /)
            const tiposHtml = p.tipo.split('/').map(t => {
                const tipoLimpio = t.trim().toLowerCase();
                const iniciales = tipoLimpio.substring(0, 3).toUpperCase();
                return `<span class="tipo-badge tipo-${tipoLimpio}">${iniciales}</span>`;
            }).join(' ');

            const evolTexto = p.evol ? `<span class="evol-text">(${p.evol})</span>` : '';
            
            return `
                <tr id="row-${p.id}" class="${isCaptured ? 'is-captured' : ''}">
                    <td>
                        <strong>${p.nombre}</strong>
                        ${evolTexto}
                    </td>
                    <td>${tiposHtml}</td>
                    <td>${p.captura}</td>
                    <td>
                        <input type="checkbox" id="${p.id}" ${isCaptured ? 'checked' : ''} 
                        onchange="toggleCapture('${p.id}')">
                    </td>
                </tr>
            `;
        }).join('');

        // Generar lista de consejos
        const guiaHtml = zona.guia.map(item => `<li>${item}</li>`).join('');

        section.innerHTML = `
            <div class="zona-header" onclick="toggleZona(this)">
                <span>${zona.nombre}</span>
                <span class="icon">▼</span>
            </div>
            <div class="zona-content">
                <div class="guia-box">
                    <strong>💡 Consejos para papá e hijo:</strong>
                    <ul>${guiaHtml}</ul>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Pokémon</th>
                            <th>Tipo</th>
                            <th>Dónde/Cómo</th>
                            <th>¿Listo?</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filasHtml || '<tr><td colspan="4">No hay capturas en esta zona.</td></tr>'}
                    </tbody>
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

// Iniciar la aplicación
init();
