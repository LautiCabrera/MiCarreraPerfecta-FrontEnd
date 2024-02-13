uploadQuestions().then(() => {
    const formulario = document.getElementById('formIntelligence');
    const preguntasIntelligencias = data.questions.intelligences;
    
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

            const inputNo = document.createElement('input');
            inputNo.type = 'radio';
            inputNo.name = `pregunta${pregunta.id}`;
            inputNo.value = 'false';
            inputNo.required = true;

            // Crear texto para indicar "Verdadero" y "Falso"
            const labelSi = document.createElement('span');
            labelSi.textContent = 'Verdadero';
            const labelNo = document.createElement('span');
            labelNo.textContent = 'Falso';

            // Agregar elementos al contenedor
            preguntaElemento.appendChild(label);
            preguntaElemento.appendChild(inputSi);
            preguntaElemento.appendChild(labelSi);
            preguntaElemento.appendChild(inputNo);
            preguntaElemento.appendChild(labelNo);

            formulario.appendChild(preguntaElemento);
        });
    });

    const botonEnviar = document.createElement('button');
    botonEnviar.type = 'submit';
    botonEnviar.textContent = 'Enviar';
    formulario.appendChild(botonEnviar);

    formulario.addEventListener('submit', function(event) {
        event.preventDefault();
        enviarRespuestasIntelligences();
    });
})
.catch((error) => {
    console.log("Error al cargar el JSON:", error);
});

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

async function enviarRespuestasIntelligences() {
    const form = document.getElementById("formIntelligence");
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

    let newData = conteoInteligencias(data.responses);

    try {
        const respuesta = await fetch("http://localhost:8080/intelligencesFilter/procesar-respuestas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newData)
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