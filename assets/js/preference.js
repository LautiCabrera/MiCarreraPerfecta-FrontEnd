uploadQuestions().then(() => {
    const formulario = document.getElementById('formPreference');
    const preguntasPreferencias = data.questions.preference;

    const contenedorExterno = document.createElement('div');
    contenedorExterno.classList.add('m-4');

    const contenedorPrincipal = document.createElement('div');
    contenedorPrincipal.classList.add('d-flex','flex-column', 'justify-content-center');

    const divBoton = document.createElement('div');
    divBoton.classList.add('d-grid', 'gap-2');

    preguntasPreferencias.forEach((pregunta) => {
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

        // Definir radio para seleccionar una opción
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

        // Crear texto para indicar "Sí" y "No"
        const labelSi = document.createElement('span');
        labelSi.textContent = 'Sí';
        labelSi.classList.add('form-check-label');
        const labelNo = document.createElement('span');
        labelNo.textContent = 'No';
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
        enviarRespuestasPreference();
    });
  })
  .catch((error) => {
    console.log("Error al cargar el JSON:", error);
  });

  async function enviarRespuestasPreference() {
    const form = document.getElementById("formPreference");
    const formData = new FormData(form);
    const respuestas = {};

    // Itera sobre todos los elementos del formulario
    for (const [name, value] of formData.entries()) {
        if (name.startsWith("pregunta")) {
            const pregunta = parseInt(name.match(/\d+/)[0]); // Extrae el número de la pregunta
            respuestas[pregunta] = value === "true";
        }
    }

    const data = {
        responses: Object.values(respuestas) // Convertir a una lista de booleanos
    };

    try {
        const respuesta = await fetch("http://localhost:8080/preferenceFilter/procesar-respuestas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (respuesta.ok) {
            const ramasDeInteres = await respuesta.json();
            // Redireccionar al usuario a la página de la encuesta de ramas con los IDs de las ramas de interés como parámetro
            window.location.href = `branch.html?ramasDeInteres=${JSON.stringify(ramasDeInteres)}`;
        } else {
            console.log("Error al procesar respuestas:", respuesta.statusText);
        }
    } catch (error) {
        console.log("Error al procesar respuestas:", error);
    }
}