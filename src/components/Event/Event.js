/**
 * Функция обрезает заголовки, которые не умещаются в 2 строки
 * (в Google Chrome используется css свойство -webkit-line-clamp)
 */
export function truncateHeaders() {
  const truncatedStrings = document.querySelectorAll('.event__title');
  truncatedStrings.forEach(item => {
    const maxHeight = parseFloat(getComputedStyle(item).lineHeight) * 2;
    if (item.scrollHeight - maxHeight > 5) item.classList.add('event__title_truncated');
    item.style.maxHeight = `${maxHeight}px`;
  });

  window.addEventListener('resize', truncateHeaders);
}

/**
 * Функция обрабатывает жесты scroll, pinch to zoom, rotate
 */
export function handleGestures() {
  const INITIAL_ZOOM = 200,
        MAX_ZOOM = 1000,
        MIN_ZOOM = 100,
        ZOOM_SPEED = 30,
        INITIAL_BRIGHTNESS = 100,
        MIN_BRIGHTNESS = 0,
        MAX_BRIGHTNESS = 500,
        INITIAL_SCROLL = 0;

  const camera = document.getElementById('camera'),
        scrollbar = document.getElementById('scrollbar'),
        zoomIndicator = document.querySelector('.camera__zoom'),
        brightnessIndicator = document.querySelector('.camera__brightness'),
        resetZoom = document.getElementById('reset-zoom');
  
  if (!camera) return;

  const currentGestures = {
    events: [],
    prevPos: null,
    prevDiff: null,
    prevAngle: null,
  };
  
  /* Начальные значения сдвига, зума и яркости */
  const nodeState = {
    zoom: INITIAL_ZOOM,
    scroll: INITIAL_SCROLL,
    brightness: INITIAL_BRIGHTNESS
  };

  resetZoom.onclick = (e) => {
    nodeState.zoom = MIN_ZOOM;
    setZoom(camera, nodeState.zoom);
    nodeState.scroll = 0;
    setScroll(camera, nodeState.scroll);
  };

  camera.addEventListener('pointerdown', e => {
    camera.setPointerCapture(e.pointerId);

    currentGestures.events.push(e);
    camera.addEventListener('pointermove', pointerMoveHandler);
  });

  camera.addEventListener('pointerup', pointerUpHandler);
  camera.addEventListener('pointercancel', pointerUpHandler);
  camera.addEventListener('pointerout', pointerUpHandler);
  camera.addEventListener('pointerleave', pointerUpHandler);

  function pointerUpHandler(e) {
    remove_event(e);
    if (currentGestures.events.length < 2) currentGestures.prevDiff = null;
    if (currentGestures.events.length < 1) currentGestures.prevPos = null;
    if (currentGestures.events.length < 2) currentGestures.prevAngle = null;
  }

  function pointerMoveHandler(e) {
    for (let i = 0; i < currentGestures.events.length; i++) {
      if (e.pointerId == currentGestures.events[i].pointerId) {
        currentGestures.events[i] = e;
        break;
      }
    }

    if (!currentGestures.events.length) {
      return;
    } else if (currentGestures.events.length === 2) {
      handleTwoTouches(e);
    } else if (currentGestures.events.length === 1) {
      handleOneTouch(e);
    }
  }

  function handleOneTouch(e) {
    if (currentGestures.prevPos) {
      const maxScrollDistance = camera.clientWidth * nodeState.zoom / 100 - e.target.clientWidth;

      nodeState.scroll += e.x - currentGestures.prevPos;

      if (nodeState.scroll > 0) {
        nodeState.scroll = 0;
      } else if (-nodeState.scroll > maxScrollDistance) {
        nodeState.scroll = -maxScrollDistance;
      }

      setScroll(e.target, nodeState.scroll, maxScrollDistance);
    }

    currentGestures.prevPos = e.x;
  }

  function handleTwoTouches(e) {
    const p1 = {x: currentGestures.events[0].clientX, y: currentGestures.events[0].clientY};
    const p2 = {x: currentGestures.events[1].clientX, y: currentGestures.events[1].clientY};;
    const curDiff = getDistance(p1, p2);
    const curAngle = getAngle(p1, p2);

    if (currentGestures.prevDiff) {
      nodeState.zoom += (curDiff - currentGestures.prevDiff) * ZOOM_SPEED;

      if (nodeState.zoom > MAX_ZOOM) {
        nodeState.zoom = MAX_ZOOM;
      } else if (nodeState.zoom < MIN_ZOOM) {
        nodeState.zoom = MIN_ZOOM;
      }

      const maxScrollDistance = camera.clientWidth * nodeState.zoom / 100 - e.target.clientWidth;
      setZoom(e.target, nodeState.zoom, maxScrollDistance);
    }

    if (currentGestures.prevAngle && Math.abs(curAngle - currentGestures.prevAngle) < 100) {
      nodeState.brightness -= curAngle - currentGestures.prevAngle;

      if (nodeState.brightness > MAX_BRIGHTNESS) {
        nodeState.brightness = MAX_BRIGHTNESS;
      } else if (nodeState.brightness < MIN_BRIGHTNESS) {
        nodeState.brightness = MIN_BRIGHTNESS;
      }

      setBrightness(e.target, nodeState.brightness);
    }

    currentGestures.prevDiff = curDiff;
    currentGestures.prevAngle = curAngle;
  }

  function remove_event(e) {
    for (let i = 0; i < currentGestures.events.length; i++) {
      if (currentGestures.events[i].pointerId == e.pointerId) {
        currentGestures.events.splice(i, 1);
        break;
      }
    }
  }

  function setScroll(el, scroll, maxScrollDistance) {
    el.style.backgroundPositionX = `${scroll}px`;
    scrollbar.style.left = `${(-scroll * 100) / maxScrollDistance}%`;
  }
  
  function setZoom(el, zoom, maxScrollDistance) {
    el.style.backgroundSize = `${zoom}%`;
    zoomIndicator.innerText = `Приближение: ${Math.round(zoom)}%`;
  
    if (zoom === MIN_ZOOM) {
      scrollbar.style.display = 'none';
    } else if (scrollbar.style.display === 'none') {
      scrollbar.style.display = 'block';
    }
    /* При уменьшении размера, если картинка смещена вправо — свдигаем,
    чтобы картинка не выходила за пределы поля видимости. */
    if (-parseFloat(el.style.backgroundPositionX) > maxScrollDistance) {
      el.style.backgroundPositionX = `${-maxScrollDistance}px`;
    }
  }
  
  function setBrightness(el, brightness) {
    el.style.filter = `brightness(${brightness}%)`;
    brightnessIndicator.innerText = `Яркость: ${Math.round(brightness)}%`;
  }
  
  function getAngle(p1, p2) {
    const rad = Math.atan2(p2.x - p1.x, p2.y - p1.y);
    const grad = rad * 180 / Math.PI;
    return grad;
  }
  
  function getDistance(p1, p2) {
    let pow1 = Math.abs(p2.x - p1.x) ^ 2;
    let pow2 = Math.abs(p2.y - p1.y) ^ 2;
    return Math.sqrt(pow1 + pow2);
  }
}

