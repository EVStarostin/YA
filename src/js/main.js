import './polyfill/pep';
import generateContent from './generateContentFromTemplate';
import {
  setMaxHeightForTruncate,
  isTouchDevice,
  isTemplateSupported,
  initAllVideos,
  openFullScreenVideo,
  closeFullScreenVideo,
} from './utils';
import handleGestures from './handleGestures';

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

    const videos = camerasWrapper.querySelectorAll('.cameras__video');
    const modal = document.querySelector('.modal');
    const modalVideo = document.getElementById('video-modal');

    videos.forEach((video) => {
      video.addEventListener('click', (e) => {
        /* Показывать модальное окно по клику на видео */
        openFullScreenVideo(e, modal);
      });
    });

    document.querySelector('.controls__hide-btn').addEventListener('click', (e) => {
      /* Скрывать модальное окно по клику на кнопку все камеры */
      closeFullScreenVideo(modal, modalVideo);
    })

    document.getElementById('brightness').addEventListener('input', (e) => {
      modalVideo.style.filter = `brightness(${e.target.value}%)`;
    });

    document.getElementById('contrast').addEventListener('input', (e) => {
      modalVideo.style.filter = `contrast(${e.target.value}%)`;
    });
  }
}
