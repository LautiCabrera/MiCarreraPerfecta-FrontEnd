document.addEventListener("DOMContentLoaded", function() {
    // Parámetro 'careerFilter' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const careerId = urlParams.get('careerFilter')
    getCareer(careerId);
});

async function getCareer(careerId, selected) {
    try {
        const respuesta = await fetch(`https://micarreraperfecta-backend-deploy.onrender.com/careerFilter/obtener-carrera-perfecta/${careerId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (respuesta.ok) {
            const response = await respuesta.json();
            crearCards(response);
        } else {
            console.log("Error al procesar respuestas:", respuesta.statusText);
        }
    } catch (error) {
        console.log("Error al procesar respuestas:", error);
    }
}

function crearCards(data) {
    const container = document.getElementById('card-container'); 
    container.innerHTML = ''; 

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