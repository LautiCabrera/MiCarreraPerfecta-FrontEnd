document.addEventListener("DOMContentLoaded", function() {
  // Parámetro 'ramasDeInteres' de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const ramasDeInteresString = urlParams.get('ramasDeInteres');
  const ramasDeInteres = JSON.parse(ramasDeInteresString);
  
  // Llama a la función para cargar las preguntas por las ramas de interés recibidas
  uploadQuestions().then(() => {
      const formulario = document.getElementById('formBranch');
      const preguntasRamas = data.questions.branch.filter(pregunta => ramasDeInteres.includes(pregunta.id));

      const contenedorExterno = document.createElement('div');
      contenedorExterno.classList.add('m-4');

      const contenedorPrincipal = document.createElement('div');
      contenedorPrincipal.classList.add('d-flex','flex-column', 'justify-content-center');

      const divBoton = document.createElement('div');
      divBoton.classList.add('d-grid', 'gap-2');

      preguntasRamas.forEach((pregunta) => {
        const preguntaElemento = document.createElement('div');
        preguntaElemento.classList.add('form-group', 'row');
    
        // Crear divs para las opciones de respuesta
        const divSi = document.createElement('div');
        divSi.classList.add('col-sm-1');
        divSi.style.marginLeft = '20px'; // Agregar el margen izquierdo
    
        const divNo = document.createElement('div');
        divNo.classList.add('col-sm-1');
        divNo.style.marginLeft = '20px'; // Agregar el margen izquierdo
    
        // Crear label para la pregunta
        const label = document.createElement('label');
        label.textContent = pregunta.pregunta;
        label.classList.add('col-sm-12', 'col-form-label');
    
        // Crear radios para seleccionar una opción
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
    
        // Crear texto para indicar "Sí" y "No"
        const labelSi = document.createElement('span');
        labelSi.textContent = 'Sí';
        labelSi.classList.add('form-check-label');
    
        const labelNo = document.createElement('span');
        labelNo.textContent = 'No';
        labelNo.classList.add('form-check-label');
    
        // Agregar elementos al contenedor de opciones de respuesta
        divSi.appendChild(inputSi);
        divSi.appendChild(labelSi);
    
        divNo.appendChild(inputNo);
        divNo.appendChild(labelNo);
    
        // Agregar elementos al contenedor de la pregunta
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
          if (oneResponsePositive(formulario)) {
            enviarRespuestasBranch();
        } else {
            alert('Debe responder al menos una pregunta con "Sí".');
        }
      });
  })
  .catch((error) => {
      console.log("Error al cargar el JSON:", error);
  });
});

async function enviarRespuestasBranch() {
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
    responses: Object.values(respuestas) // Convertir a una lista de booleanos
  };

  try {
    const respuesta = await fetch("http://localhost:8080/branchFilter/procesar-respuestas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    if (respuesta.ok) {
      window.location.href = `career.html`;
    } else {
      console.log("Error al procesar respuestas:", respuesta.statusText);
    }
  } catch (error) {
    console.log("Error al procesar respuestas:", error);
  }
}