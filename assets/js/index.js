let data;

async function uploadQuestions() {
    try {
      const respuesta = await fetch('./assets/questions.json');
      if (!respuesta.ok) {
        throw new Error(`Error al cargar el JSON: ${respuesta.status} ${respuesta.statusText}`);
      }
      const datos = await respuesta.json();
      data = datos;
    } catch (error) {
      console.error('Error al cargar las preguntas:', error);
      return [];
    }
}

function oneResponsePositive(formulario) {
  const formData = new FormData(formulario);

  // Itera sobre todos los elementos del formulario
  for (const [name, value] of formData.entries()) {
      if (value === 'true') {
          return true; // Si encuentra al menos una respuesta positiva, devuelve true
      }
  }
  return false; // Si no encuentra ninguna respuesta positiva, devuelve false
}  