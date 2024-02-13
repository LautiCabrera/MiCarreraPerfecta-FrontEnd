document.addEventListener("DOMContentLoaded", function() {
  // Parámetro 'ramasDeInteres' de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const ramasDeInteresString = urlParams.get('ramasDeInteres');
  const ramasDeInteres = JSON.parse(ramasDeInteresString);
  
  // Llama a la función para cargar las preguntas por las ramas de interés recibidas
  uploadQuestions().then(() => {
      const formulario = document.getElementById('formBranch');
      const preguntasRamas = data.questions.branch.filter(pregunta => ramasDeInteres.includes(pregunta.id));
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
          enviarRespuestasBranch();
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
      // Redireccionar al usuario a la encuesta de preferencias
      // window.location.href = `.html`;
      const data = await respuesta.json(); // Esto convierte la respuesta del servidor en JSON
      console.log('Respuesta del servidor:', data);
    } else {
      console.log("Error al procesar respuestas:", respuesta.statusText);
    }
  } catch (error) {
    console.log("Error al procesar respuestas:", error);
  }
}