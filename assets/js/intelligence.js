uploadQuestions().then(() => {
    const formulario = document.getElementById('formIntelligence');
    const preguntasIntelligencias = data.questions.intelligences;

    const contenedorExterno = document.createElement('div');
    contenedorExterno.classList.add('m-4');

    const contenedorPrincipal = document.createElement('div');
    contenedorPrincipal.classList.add('d-flex','flex-column', 'justify-content-center');

    const divBoton = document.createElement('div');
    divBoton.classList.add('d-grid', 'gap-2');

    Object.values(preguntasIntelligencias).forEach((inteligencia) => {
        inteligencia.forEach((pregunta) => {
            const preguntaElemento = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = pregunta.pregunta;

            // Definir radio para seleccionar una opción
            const inputSi = document.createElement('input');
            inputSi.type = 'radio';
            inputSi.name = `pregunta${pregunta.id}`;
            inputSi.value = 'true';
            inputSi.required = true;
            inputSi.classList.add('form-check-input');

            const inputNo = document.createElement('input');
            inputNo.type = 'radio';
            inputNo.name = `pregunta${pregunta.id}`;
            inputNo.value = 'false';
            inputNo.required = true;
            inputNo.classList.add('form-check-input');

            // Crear divs para agrupar elementos
            const divSi = document.createElement('div');
            divSi.classList.add('form-check');
            const divNo = document.createElement('div');
            divNo.classList.add('form-check');

            // Crear texto para indicar "Verdadero" y "Falso"
            const labelSi = document.createElement('span');
            labelSi.textContent = 'Verdadero';
            labelSi.classList.add('form-check-label');
            const labelNo = document.createElement('span');
            labelNo.textContent = 'Falso';
            labelNo.classList.add('form-check-label');

            // Agregar elementos al contenedor de la pregunta
            divSi.appendChild(inputSi);
            divSi.appendChild(labelSi);
            divNo.appendChild(inputNo);
            divNo.appendChild(labelNo);

            preguntaElemento.appendChild(label);
            preguntaElemento.appendChild(divSi);
            preguntaElemento.appendChild(divNo);

            // Agregar la pregunta al contenedor principal
            contenedorPrincipal.appendChild(preguntaElemento);
        });
    });

    // Agregar el contenedor principal al formulario
    contenedorExterno.appendChild(contenedorPrincipal);
    formulario.appendChild(contenedorExterno);

    const botonEnviar = document.createElement('button');
    botonEnviar.type = 'submit';
    botonEnviar.textContent = 'Siguiente sección';
    botonEnviar.classList.add('btn', 'btn-outline-success');

    divBoton.appendChild(botonEnviar);
    formulario.appendChild(divBoton);

    formulario.addEventListener('submit', function(event) {
        event.preventDefault();
        crearDatos();
    });
})
.catch((error) => {
    console.log("Error al cargar el JSON:", error);
});

// Obtener respuestas del formulario y contar inteligencias
function obtenerRespuestas() {
    const form = document.getElementById("formIntelligence");
    const formData = new FormData(form);
    const respuestas = {};

    // Iterar sobre todos los elementos del formulario
    for (const [name, value] of formData.entries()) {
        if (name.startsWith("pregunta")) {
            const pregunta = parseInt(name.match(/\d+/)[0]); // Extraer el número de la pregunta
            respuestas[pregunta] = value === "true";
        }
    }

    return Object.values(respuestas);
}

// Contar inteligencias
function conteoInteligencias(responses) {
    const intelligencias = [];
    for (let i = 0; i < responses.length; i += 5) {
        let trueCount = 0;
        for (let j = i; j < i + 5 && j < responses.length; j++) {
            if (responses[j]) {
                trueCount++;
            }
        }
        
        intelligencias.push(trueCount);
    }
    
    return intelligencias;
}

// Obtener ubicación del usuario si es posible
async function obtenerUbicacion() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                resolve(position.coords);
            }, function(error) {
                console.error("Error al obtener la ubicación:", error);
                resolve(null);
            });
        } else {
            console.log("Geolocalización no disponible en este navegador.");
            resolve(null);
        }
    });
}

// Crear el objeto de datos con inteligencias y ubicación
async function crearDatos() {
    const intelligenceResponse = obtenerRespuestas(); 
    const ubicationResponse = await obtenerUbicacion(); // Obtener ubicación si es posible

    const data = {
        intelligenceResponse: conteoInteligencias(intelligenceResponse), // Utiliza la función para contar inteligencias
        ubicationResponse: ubicationResponse ? [ubicationResponse.latitude, ubicationResponse.longitude] : [] // Crea un array con la latitud y longitud o una lista vacía
    };

    // Llamar a la función para enviar las respuestas de inteligencias
    await enviarRespuestasIntelligences(data);
}

// Enviar respuestas al servidor
async function enviarRespuestasIntelligences(data) {
    try {
        const respuesta = await fetch("http://localhost:8080/intelligencesFilter/procesar-respuestas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (respuesta.ok) {
            // Redireccionar al usuario a la encuesta de preferencias
            window.location.href = `preference.html`;
        } else {
            console.log("Error al procesar respuestas:", respuesta.statusText);
        }
    } catch (error) {
        console.log("Error al procesar respuestas:", error);
    }
}