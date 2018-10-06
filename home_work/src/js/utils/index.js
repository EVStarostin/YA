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
