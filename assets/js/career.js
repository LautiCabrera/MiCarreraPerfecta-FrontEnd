let careerId;

uploadQuestions().then(() => {
  const formulario = document.getElementById('formCareer');
  const categorias = data.questions.career;
  const respuestasUsuario = {}; // Objeto para almacenar las respuestas del usuario

  const contenedorExterno = document.createElement('div');
  contenedorExterno.classList.add('m-4');

  const contenedorPrincipal = document.createElement('div');
  contenedorPrincipal.classList.add('d-flex', 'flex-column', 'justify-content-center');

  const divBoton = document.createElement('div');
  divBoton.classList.add('d-grid', 'gap-2');

  // Iterar sobre todas las categorías
  Object.keys(categorias).forEach((categoria) => {
      const preguntasRamas = categorias[categoria];

      // Iterar sobre las preguntas de la categoría actual
      preguntasRamas.forEach((pregunta) => {
          const preguntaElemento = document.createElement('div');
          preguntaElemento.classList.add('mb-3');

          const label = document.createElement('label');
          label.textContent = pregunta.pregunta;

          // Agregar la pregunta al contenedor de la pregunta
          preguntaElemento.appendChild(label);

          // Crear opciones de respuesta según el JSON
          Object.entries(pregunta.respuestas).forEach(([opcionTexto, valor]) => {
              const input = document.createElement('input');
              input.type = 'radio';
              input.name = `pregunta${pregunta.id}_${categoria}`;
              input.value = valor;
              input.required = true;
              input.classList.add('form-check-input');

              // Crear texto para la opción de respuesta
              const labelOpcion = document.createElement('span');
              labelOpcion.textContent = opcionTexto;
              labelOpcion.classList.add('form-check-label');

              // Agregar elementos de opción al contenedor de la pregunta
              const divOpcion = document.createElement('div');
              divOpcion.classList.add('form-check');
              divOpcion.appendChild(input);
              divOpcion.appendChild(labelOpcion);
              preguntaElemento.appendChild(divOpcion);
          });

          // Agregar la pregunta al contenedor principal
          contenedorPrincipal.appendChild(preguntaElemento);
      });
  });

  // Agregar el contenedor principal al formulario
  contenedorExterno.appendChild(contenedorPrincipal);
  formulario.appendChild(contenedorExterno);

  const botonEnviar = document.createElement('button');
  botonEnviar.type = 'submit';
  botonEnviar.textContent = 'Obtener mi carrera perfecta';
  botonEnviar.classList.add('btn', 'btn-outline-success');

  divBoton.appendChild(botonEnviar);
  formulario.appendChild(divBoton);

  formulario.addEventListener('submit', function(event) {
      event.preventDefault();
      enviarRespuestasCareer();
  });
  document.dispatchEvent(new Event('formularioGenerado'));
})
.catch((error) => {
  console.log("Error al cargar el JSON:", error);
});

async function enviarRespuestasCareer() {
  // Capturar las respuestas del usuario
  const respuestas = [];
  const inputs = document.querySelectorAll('input[type="radio"]:checked');
  inputs.forEach((input) => {
      respuestas.push(parseInt(input.value));
  });

  try {
      const respuesta = await fetch("https://micarreraperfecta-backend-deploy.onrender.com/careerFilter/procesar-respuestas", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(respuestas)
      });
      if (respuesta.ok) {
          const response = await respuesta.text();
          window.location.href = `miCareer.html?careerFilter=${response}`;
      } else {
          // Crear el mensaje y agregarlo al contenedor
          const mensaje = document.createElement('p');
          mensaje.textContent = 'No se encontraron carreras con ninguno de los filtros aplicados. Por favor, intente con otros.';
          mensaje.classList.add('text-center', 'alert', 'alert-danger');
          document.getElementById('not-result').appendChild(mensaje);
      }
  } catch (error) {
      console.log("Error al procesar respuestas:", error);
  }
}