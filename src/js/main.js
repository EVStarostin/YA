import 'pepjs';
import generateContent from './generateContentFromTemplate';
import handleGestures from './handleGestures';
import {
  setMaxHeightForTruncate,
  isTouchDevice,
  isTemplateSupported,
  initAllVideos,
  openFullScreenVideo,
  closeFullScreenVideo,
} from './utils';

window.onload = async function () {
  /* Генерируются карточки из json данных на основании шаблона */
  if (isTemplateSupported) {
    await generateContent();
    // Установим максимально-возможную высоту для заголовков карточек
    setMaxHeightForTruncate();
  } else {
    console.error('тег <template> не поддерживается браузером. Обновитесь на Yandex Browser');
  }

  /* Если это тач устройства, то добавляем в body класс .touch */
  if (isTouchDevice()) {
    document.body.classList.add('touch');
  }

  /* При изменении размера окна пересчитываем максимально-возможную высоту заголовков карточек */
  window.onresize = function () {
    setMaxHeightForTruncate();
  }

  /* Показывать / скрывать меню на узких экранах по клику на "бургерное меню" */
  document.querySelector('#toggle-menu').addEventListener('click', () => {
    document.querySelector('#nav-menu').classList.toggle('menu_visible');
  });

  /* Обработчики жестов */
  handleGestures();

  const camerasWrapper = document.querySelector('.cameras');
  if (camerasWrapper) {
    /* Инициализировать все видео */
    initAllVideos();

    const videosBlocks = camerasWrapper.querySelectorAll('.cameras__item');

    videosBlocks.forEach((block) => {
      block.addEventListener('click', (e) => {
        /* Показывать модальное окно по клику на видео */
        openFullScreenVideo(block);
      });
    });

    document.querySelector('.controls__all-cameras').addEventListener('click', (e) => {
      /* Скрывать модальное окно по клику на кнопку все камеры */
      closeFullScreenVideo();
    })

    let filter = { brightness: 100, contrast: 100 };
    document.getElementById('brightness').addEventListener('input', (e) => {
      const fullScreenVideo = document.querySelector('.cameras__item_fullscreen .cameras__video');
      filter.brightness = e.target.value;
      fullScreenVideo.style.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%)`;
    });

    document.getElementById('contrast').addEventListener('input', (e) => {
      const fullScreenVideo = document.querySelector('.cameras__item_fullscreen .cameras__video');
      filter.contrast = e.target.value;
      fullScreenVideo.style.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%)`;
    });
  }
}
