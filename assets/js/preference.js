
uploadQuestions().then(() => {
    const formulario = document.getElementById('formPreference');
    const preguntasRamas = data.questions.preference;
    preguntasRamas.forEach((pregunta) => {
        const preguntaElemento = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = pregunta.pregunta;
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = `pregunta${pregunta.id}`;
        preguntaElemento.appendChild(label);
        preguntaElemento.appendChild(input);
        formulario.appendChild(preguntaElemento);
    });

    const botonEnviar = document.createElement('button');
    botonEnviar.type = 'submit';
    botonEnviar.textContent = 'Enviar';
    formulario.appendChild(botonEnviar);

    formulario.addEventListener('submit', function(event) {
        event.preventDefault();
        const respuestas = Array.from(formulario.elements).filter(element => element.type === 'checkbox' && element.checked);
        console.log(respuestas);
    });
  })
  .catch((error) => {
    console.log("Error al cargar el JSON:", error);
  });