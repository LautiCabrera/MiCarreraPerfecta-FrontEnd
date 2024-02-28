let resultados = []; // Inicializar la variable resultados

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('searchForm');
    const filterOptions = document.getElementById('filterOptions');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const searchTerm = document.getElementById('searchTerm').value;
        if (searchTerm.trim() !== '') {
            await searchCareers(searchTerm);
            if (resultados.length > 0) {
                filterOptions.style.display = 'block'; 
                enableCheckboxes(true); 
                filtrarResultados();
            } else {
                filterOptions.style.display = 'none'; 
                message("No se encontraron resultados, prueba con otra búsqueda.");
                enableCheckboxes(true); 
            }
        } 
    });

    // Event listener para cambios en los checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filtrarResultados);
    });
});

async function searchCareers(searchTerm) {
    try {
        const response = await fetch("http://localhost:8080/careerFilter/busqueda-carrera", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(searchTerm)
        });

        if (response.ok) {
            resultados = await response.json(); // Almacenar los resultados en variable global
        } else {
            console.log("Error al procesar la solicitud:", response.statusText);
        }
    } catch (error) {
        console.log("Error al procesar la solicitud:", error);
    }
}

function filtrarResultados() {
    const modalidadesSeleccionadas = obtenerModalidadesSeleccionadas();
    const gestionesSeleccionadas = obtenerGestionesSeleccionadas();

    // Borra las cartas existentes
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    // Si no hay filtros seleccionados, mostrar todos los resultados
    if (modalidadesSeleccionadas.length === 0 && gestionesSeleccionadas.length === 0) {
        crearCards(resultados);
        enableCheckboxes(true); // Habilitar los checkboxes
        return;
    }

    // Filtra los resultados según las selecciones de los checkboxes
    let carrerasFiltradas = resultados.filter(carrera => {
        return (modalidadesSeleccionadas.length === 0 || modalidadesSeleccionadas.includes(carrera[4])) &&
               (gestionesSeleccionadas.length === 0 || gestionesSeleccionadas.includes(carrera[9]));
    });

    // Si no hay resultados después de aplicar los filtros, mostrar el mensaje
    if (carrerasFiltradas.length === 0) {
        message("No se encontraron resultados con los filtros aplicados.");
    } else {
        // Si hay resultados, crear y mostrar las nuevas cartas filtradas
        crearCards(carrerasFiltradas);
    }
    enableCheckboxes(true); // Habilitar los checkboxes
}

function obtenerModalidadesSeleccionadas() {
    return obtenerValoresSeleccionados('modalidad');
}

function obtenerGestionesSeleccionadas() {
    return obtenerValoresSeleccionados('gestion');
}

function obtenerValoresSeleccionados(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function message(mensaje) {
    const container = document.getElementById('searchResults');
    container.innerHTML = `<p class="alert alert-danger">${mensaje}</p>`;
}

function enableCheckboxes(enabled) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.disabled = !enabled;
    });
}

function crearCards(data) {
    const container = document.getElementById('searchResults'); 

    // No necesitas eliminar el contenido existente, solo agregar las nuevas cartas
    data.forEach(objeto => {
        const card = document.createElement('div');
        card.classList.add('card', 'm-lg-5', 'p-lg-4', 'm-md-0', 'p-md-0'); 
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${objeto[0]}</h5><br>
                <p class="text-card">${objeto[1]}</p><br>
                <p class="text-card"><b>Duración</b>: ${objeto[2]} meses.</p><br>
                <p class="text-card"><b>Tipo de carrera</b>: ${objeto[3]}.</p><br>
                <p class="text-card"><b>Modalidad</b>: ${objeto[4]}.</p><br>
                <p class="text-card"><b>Rama de estudio dedicada a la ${objeto[5]};</b></p><br>
                <p class="text-card">${objeto[6]}</p><br>
                <p class="text-card"><b>Alcance del título:</b> ${objeto[7]}.</p><br>
                <p class="text-card"><b>Factultad:</b> ${objeto[8]}.</p><br>
                <p class="text-card"><b>Tipo de gestión:</b> ${objeto[9]}.</p><br>
                <p class="text-card"><b>Ingreso con pre:</b> ${objeto[10]}.</p><br>
                <p class="text-card"><b>Campus:</b> ${objeto[11]}.</p><br>
                <p class="text-card"><b>Localidad:</b> ${objeto[12]}.</p><br>
                <p class="text-card"><b>Email de contacto:</b> ${objeto[14]}</p><br>
                <a href="${objeto[13]}" target="_blank" class="btn btn-primary">Más información</a>
            </div>
        `;

        container.appendChild(card);
    });
}