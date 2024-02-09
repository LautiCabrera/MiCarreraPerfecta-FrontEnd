uploadQuestions().then(() => {
    const formulario = document.getElementById('formPreference');
    const preguntasRamas = data.questions.preference;
    preguntasRamas.forEach((pregunta) => {
        const preguntaElemento = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = pregunta.pregunta;
        const inputSi = document.createElement('input');
        inputSi.type = 'radio';
        inputSi.name = `pregunta${pregunta.id}`;
        inputSi.value = 'true';
        inputSi.required = true;

        // Definir radio para seleccionar una opción
        const inputNo = document.createElement('input');
        inputNo.type = 'radio';
        inputNo.name = `pregunta${pregunta.id}`;
        inputNo.value = 'false';
        inputNo.required = true;

        // Crear texto para indicar "Sí" y "No"
        const labelSi = document.createElement('span');
        labelSi.textContent = 'Sí';
        const labelNo = document.createElement('span');
        labelNo.textContent = 'No';

        // Agregar elementos al contenedor
        preguntaElemento.appendChild(label);
        preguntaElemento.appendChild(inputSi);
        preguntaElemento.appendChild(labelSi);
        preguntaElemento.appendChild(inputNo);
        preguntaElemento.appendChild(labelNo);

        formulario.appendChild(preguntaElemento);
    });

    const botonEnviar = document.createElement('button');
    botonEnviar.type = 'submit';
    botonEnviar.textContent = 'Enviar';
    formulario.appendChild(botonEnviar);

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