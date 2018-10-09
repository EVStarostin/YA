import initVideo from '../initVideo';

export function setMaxHeightForTruncate() {
  setTimeout(() => {
    const truncatedStrings = document.querySelectorAll('.event__title');
    truncatedStrings.forEach(item => {
      const maxHeight = parseFloat(getComputedStyle(item).lineHeight) * 2;
      if (item.scrollHeight - maxHeight > 5) item.classList.add('event__title_truncated');
      item.style.maxHeight = `${maxHeight}px`;
    });
  }, 100);
}

export function isTouchDevice() {
  return 'ontouchstart' in window;
}

export function isTemplateSupported() {
  return 'content' in document.createElement('template');
}

export function getDistance(p1, p2) {
  let pow1 = Math.abs(p2.x - p1.x) ^ 2;
  let pow2 = Math.abs(p2.y - p1.y) ^ 2;
  return Math.sqrt(pow1 + pow2);
}

export function getAngle(p1, p2) {
  const rad = Math.atan2(p2.x - p1.x, p2.y - p1.y);
  const grad = rad * 180 / Math.PI;
  return grad;
}

export function setZoom(el, zoom, maxScrollDistance) {
  el.style.backgroundSize = `${zoom}%`;
  document.querySelector('.event__pic-zoom').innerText = `Приближение: ${Math.round(zoom)}%`;

  const scrollBar = document.querySelector('.event__pic-scrollbar');
  if (zoom === 100) {
    scrollBar.style.display = 'none';
  } else if (scrollBar.style.display === 'none') {
    scrollBar.style.display = 'block';
  }
  /* При уменьшении размера, если картинка смещена вправо — свдигаем,
  чтобы картинка не выходила за пределы поля видимости. */
  if (-parseFloat(el.style.backgroundPositionX) > maxScrollDistance) {
    el.style.backgroundPositionX = `${-maxScrollDistance}px`;
  }
}

export function setBrightness(el, brightness) {
  el.style.filter = `brightness(${brightness}%)`;
  document.querySelector('.event__pic-brightness').innerText = `Яркость: ${Math.round(brightness)}%`;
}

export function setScroll(el, scroll, maxScrollDistance) {
  el.style.backgroundPositionX = `${scroll}px`;
  document.querySelector('.event__pic-scrollbar').style.left = `${(-scroll * 100) / maxScrollDistance}%`;
}

export function initAllVideos() {
  initVideo(
    document.getElementById('video-1'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8'
  );
  initVideo(
    document.getElementById('video-2'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8'
  );
  initVideo(
    document.getElementById('video-3'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8'
  );
  initVideo(
    document.getElementById('video-4'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
  );
}

export function openFullScreenVideo(e, modal) {
  initVideo(
    document.getElementById('video-modal'),
    e.target.dataset.source
  );

  document.getElementById('brightness').value = 100;
  document.getElementById('contrast').value = 100;

  const viewportCenter = {
    x: document.documentElement.clientWidth / 2,
    y: document.documentElement.clientHeight / 2
  };
  const clickedElementCenter = {
    x: e.target.getBoundingClientRect().left + e.target.clientWidth / 2,
    y: e.target.getBoundingClientRect().top + e.target.clientHeight / 2
  };
  const translation = {
    x: clickedElementCenter.x - viewportCenter.x,
    y: clickedElementCenter.y - viewportCenter.y
  };

  modal.dataset.translateX = translation.x;
  modal.dataset.translateY = translation.y;

  modal.style.transform = `translate(${translation.x}px, ${translation.y}px) scale(0)`;
  modal.classList.add('modal_visible');
  setTimeout(()=>{
    modal.style.transform = 'translate(0) scale(1)';
  }, 10);
}

export function closeFullScreenVideo(modal) {
  const { translateX, translateY } = modal.dataset;
  modal.style.transform = `translate(${translateX}px, ${translateY}px) scale(0)`;
  setTimeout(() => {
    modal.classList.remove('modal_visible');
  }, 500);
}
