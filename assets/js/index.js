let data;

async function uploadQuestions() {
    try {
      const respuesta = await fetch('./assets/questions.json');
      if (!respuesta.ok) {
        throw new Error(`Error al cargar el JSON: ${respuesta.status} ${respuesta.statusText}`);
      }
      const datos = await respuesta.json();
      data = datos;
      console.log(data)
    } catch (error) {
      console.error('Error al cargar las preguntas:', error);
      return [];
    }
}