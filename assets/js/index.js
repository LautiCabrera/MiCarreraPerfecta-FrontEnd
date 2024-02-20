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

document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slider img');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');

  let slideIndex = slides.length - 1; // Iniciar con el último índice
  const slideWidth = slides[0].clientWidth;
  let intervalId; // Variable para almacenar el ID del intervalo

  function startSlider() {
    intervalId = setInterval(nextSlide, 3000); // Cambia 3000 por el tiempo en milisegundos entre cada slide
  }

  function stopSlider() {
    clearInterval(intervalId);
  }

  function nextSlide() {
    slideIndex++;
    slider.style.transition = "transform 0.5s ease-in-out";
    slider.style.transform = `translateX(-${slideIndex * slideWidth}px)`;

    // Si llegamos al último slide, volvemos al primero y luego aplicamos la transición
    if (slideIndex >= slides.length) {
      setTimeout(() => {
        slider.style.transition = "none";
        slider.style.transform = `translateX(-${slideWidth}px)`;
        slideIndex = 0;
        setTimeout(() => {
          slider.style.transition = "transform 0.5s ease-in-out";
          slider.style.transform = `translateX(0)`;
        }, 50);
      }, 500);
    }
  }

  function prevSlide() {
    if (slideIndex <= 0) {
      slideIndex = slides.length - 1;
      slider.style.transition = "none";
      slider.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
      setTimeout(() => {
        slider.style.transition = "transform 0.5s ease-in-out";
        slideIndex--;
        slider.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
      }, 50);
    } else {
      slideIndex--;
      slider.style.transition = "transform 0.5s ease-in-out";
      slider.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
    }
  }

  // Iniciar el slider automáticamente
  startSlider();

  // Detener el slider cuando el usuario interactúa con los botones
  prevButton.addEventListener('click', () => {
    stopSlider();
    prevSlide();
    startSlider(); // Reiniciar el slider después de la interacción del usuario
  });

  nextButton.addEventListener('click', () => {
    stopSlider();
    nextSlide();
    startSlider(); // Reiniciar el slider después de la interacción del usuario
  });
});