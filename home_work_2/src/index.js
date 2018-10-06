import generateContent from './generateContentFromTemplate';
import { setMaxHeightForTruncate, isTouchDevice, isTemplateSupported } from './utils';

window.onload = async function () {
  if (isTemplateSupported) {
    await generateContent();
    setMaxHeightForTruncate();
  } else {
    console.error('тег <template> не поддерживается браузером. Обновитесь на Yandex Browser');
  }

  if (isTouchDevice()) {
    document.body.classList.add('touch');
  }

  window.onresize = function() {
    setMaxHeightForTruncate();
  }

  document.querySelector('#toggle-menu').addEventListener('click', () => {
    document.querySelector('#nav-menu').classList.toggle('menu_visible');
  });
}



