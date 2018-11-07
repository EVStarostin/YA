import { CurrentGestures, NodeState, Point } from "Models/Event";

/**
 * Функция обрезает заголовки, которые не умещаются в 2 строки
 * (в Google Chrome используется css свойство -webkit-line-clamp)
 */
export function truncateHeaders() {
  const truncatedStrings = document.querySelectorAll<HTMLHeadingElement>(".event__title");
  truncatedStrings.forEach((item) => {
    const lineHeight = getComputedStyle(item).lineHeight;
    if (!lineHeight) { return; }
    const maxHeight = parseFloat(lineHeight) * 2;
    if (item.scrollHeight - maxHeight > 5) { item.classList.add("event__title_truncated"); }
    item.style.maxHeight = `${maxHeight}px`;
  });

  window.addEventListener("resize", truncateHeaders);
}

/**
 * Функция обрабатывает жесты scroll, pinch to zoom, rotate
 */
export function handleGestures() {
  const INITIAL_ZOOM = 200;
  const MAX_ZOOM = 1000;
  const MIN_ZOOM = 100;
  const ZOOM_SPEED = 1;
  const INITIAL_BRIGHTNESS = 100;
  const MIN_BRIGHTNESS = 0;
  const MAX_BRIGHTNESS = 500;
  const INITIAL_SCROLL = 0;

  const camera = document.querySelector<HTMLDivElement>("#camera");
  const scrollbar = document.querySelector<HTMLDivElement>("#scrollbar");
  const zoomIndicator = document.querySelector<HTMLParagraphElement>(".camera__zoom");
  const brightnessIndicator = document.querySelector<HTMLParagraphElement>(".camera__brightness");
  const resetZoom = document.querySelector<HTMLButtonElement>("#reset-zoom");

  if (!camera) { return; }

  const currentGestures: CurrentGestures = {
    events: [],
    prevPos: null,
    prevDiff: null,
    prevAngle: null,
  };

  /* Начальные значения сдвига, зума и яркости */
  const nodeState: NodeState = {
    zoom: INITIAL_ZOOM,
    scroll: INITIAL_SCROLL,
    brightness: INITIAL_BRIGHTNESS,
  };

  if (resetZoom) {
    resetZoom.onclick = () => {
      nodeState.zoom = MIN_ZOOM;
      setZoom(camera, nodeState.zoom);
      nodeState.scroll = 0;
      setScroll(camera, nodeState.scroll);
    };
  }

  camera.addEventListener("pointerdown", (e) => {
    camera.setPointerCapture(e.pointerId);

    currentGestures.events.push(e);
    camera.addEventListener("pointermove", pointerMoveHandler);
  });

  camera.addEventListener("pointerup", pointerUpHandler);
  camera.addEventListener("pointercancel", pointerUpHandler);
  camera.addEventListener("pointerout", pointerUpHandler);
  camera.addEventListener("pointerleave", pointerUpHandler);

  function pointerUpHandler(e: PointerEvent) {
    removeEvent(e);
    if (currentGestures.events.length < 2) { currentGestures.prevDiff = null; }
    if (currentGestures.events.length < 1) { currentGestures.prevPos = null; }
    if (currentGestures.events.length < 2) { currentGestures.prevAngle = null; }
  }

  function pointerMoveHandler(e: PointerEvent) {
    for (let i = 0; i < currentGestures.events.length; i++) {
      if (e.pointerId === currentGestures.events[i].pointerId) {
        currentGestures.events[i] = e;
        break;
      }
    }

    if (currentGestures.events.length === 2) {
      handleTwoTouches();
    } else if (currentGestures.events.length === 1) {
      handleOneTouch(e);
    }
  }

  function handleOneTouch(e: PointerEvent) {
    if (currentGestures.prevPos && camera) {
      const maxScrollDistance = camera.clientWidth * nodeState.zoom / 100 - camera.clientWidth;

      nodeState.scroll += e.x - currentGestures.prevPos;

      if (nodeState.scroll > 0) {
        nodeState.scroll = 0;
      } else if (-nodeState.scroll > maxScrollDistance) {
        nodeState.scroll = -maxScrollDistance;
      }

      setScroll(camera, nodeState.scroll, maxScrollDistance);
    }

    currentGestures.prevPos = e.x;
  }

  function handleTwoTouches() {
    if (!camera) { return; }
    const p1 = { x: currentGestures.events[0].clientX, y: currentGestures.events[0].clientY };
    const p2 = { x: currentGestures.events[1].clientX, y: currentGestures.events[1].clientY };
    const curDiff = getDistance(p1, p2);
    const curAngle = getAngle(p1, p2);

    if (currentGestures.prevDiff) {
      nodeState.zoom += (curDiff - currentGestures.prevDiff) * ZOOM_SPEED;

      if (nodeState.zoom > MAX_ZOOM) {
        nodeState.zoom = MAX_ZOOM;
      } else if (nodeState.zoom < MIN_ZOOM) {
        nodeState.zoom = MIN_ZOOM;
      }

      const maxScrollDistance = camera.clientWidth * nodeState.zoom / 100 - camera.clientWidth;
      setZoom(camera, nodeState.zoom, maxScrollDistance);
    }

    if (currentGestures.prevAngle && Math.abs(curAngle - currentGestures.prevAngle) < 100) {
      nodeState.brightness -= curAngle - currentGestures.prevAngle;

      if (nodeState.brightness > MAX_BRIGHTNESS) {
        nodeState.brightness = MAX_BRIGHTNESS;
      } else if (nodeState.brightness < MIN_BRIGHTNESS) {
        nodeState.brightness = MIN_BRIGHTNESS;
      }

      setBrightness(camera, nodeState.brightness);
    }

    currentGestures.prevDiff = curDiff;
    currentGestures.prevAngle = curAngle;
  }

  function removeEvent(e: PointerEvent) {
    for (let i = 0; i < currentGestures.events.length; i++) {
      if (currentGestures.events[i].pointerId === e.pointerId) {
        currentGestures.events.splice(i, 1);
        break;
      }
    }
  }

  function setScroll(el: HTMLDivElement, scroll: number, maxScrollDistance?: number) {
    el.style.backgroundPositionX = `${scroll}px`;
    if (scrollbar && maxScrollDistance) {
      scrollbar.style.left = `${(-scroll * 100) / maxScrollDistance}%`;
    }
  }

  function setZoom(el: HTMLDivElement, zoom: number, maxScrollDistance?: number) {
    el.style.backgroundSize = `${zoom}%`;
    if (zoomIndicator) { zoomIndicator.innerText = `Приближение: ${Math.round(zoom)}%`; }

    if (zoom === MIN_ZOOM && scrollbar) {
      scrollbar.style.display = "none";
    } else if (scrollbar && scrollbar.style.display === "none") {
      scrollbar.style.display = "block";
    }
    /* При уменьшении размера, если картинка смещена вправо — свдигаем,
    чтобы картинка не выходила за пределы поля видимости. */
    const BgPosition = el.style.backgroundPositionX;
    if (BgPosition && maxScrollDistance && -parseFloat(BgPosition) > maxScrollDistance) {
      el.style.backgroundPositionX = `${-maxScrollDistance}px`;
    }
  }

  function setBrightness(el: HTMLDivElement, brightness: number) {
    el.style.filter = `brightness(${brightness}%)`;
    if (brightnessIndicator) { brightnessIndicator.innerText = `Яркость: ${Math.round(brightness)}%`; }
  }

  function getAngle(p1: Point, p2: Point) {
    const rad = Math.atan2(p2.x - p1.x, p2.y - p1.y);
    const grad = rad * 180 / Math.PI;
    return grad;
  }

  function getDistance(p1: Point, p2: Point) {
    const pow1 = Math.abs(p2.x - p1.x) ** 2;
    const pow2 = Math.abs(p2.y - p1.y) ** 2;
    return Math.sqrt(pow1 + pow2);
  }
}
