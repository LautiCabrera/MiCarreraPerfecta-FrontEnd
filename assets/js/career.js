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

  // Imprimir las respuestas por consola
  console.log("Respuestas del usuario:", respuestas);

  try {
      const respuesta = await fetch("http://localhost:8080/careerFilter/procesar-respuestas", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(respuestas) // Enviar directamente la lista de valores de respuesta
      });
      if (respuesta.ok) {
          const response = await respuesta.json(); // Convertir la respuesta a JSON
          console.log("Respuesta del servidor:", response);
          window.location.href = `miCareer.html`;
      } else {
          console.log("Error al procesar respuestas:", respuesta.statusText);
      }
  } catch (error) {
      console.log("Error al procesar respuestas:", error);
  }
}