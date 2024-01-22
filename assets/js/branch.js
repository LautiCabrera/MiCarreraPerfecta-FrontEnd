
uploadQuestions().then(() => {
    const formulario = document.getElementById('formBranch');
    const preguntasRamas = data.questions.branch;
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
        enviarRespuestas();
    });
  })
  .catch((error) => {
    console.log("Error al cargar el JSON:", error);
  });

  async function enviarRespuestas() {
    const form = document.getElementById("formBranch");
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
      respuestas: Object.values(respuestas) // Convertir a una lista de booleanos
    };
  
    try {
      const respuesta = await fetch("http://localhost:8080/branchFilter/procesar-respuestas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      if (respuesta.ok) {
        const carrerasDeInteres = await respuesta.json();
        console.log("Carreras de interés:", carrerasDeInteres);
        // Aquí puedes manejar las carreras de interés como desees
      } else {
        console.log("Error al procesar respuestas:", respuesta.statusText);
      }
    } catch (error) {
      console.log("Error al procesar respuestas:", error);
    }
  }
  