import { ICurrentGestures, IPoint, INodeState } from '../../models';

/**
 * Функция обрезает заголовки, которые не умещаются в 2 строки
 * (в Google Chrome используется css свойство -webkit-line-clamp)
 */
export function truncateHeaders(): void {
  const truncatedStrings: NodeListOf<HTMLHeadingElement> = document.querySelectorAll('.event__title');
  truncatedStrings.forEach((item) => {
    const lineHeight: string | null = getComputedStyle(item).lineHeight;
    if (!lineHeight) return;
    const maxHeight: number = parseFloat(lineHeight) * 2;
    if (item.scrollHeight - maxHeight > 5) item.classList.add('event__title_truncated');
    item.style.maxHeight = `${maxHeight}px`;
  });

  window.addEventListener('resize', truncateHeaders);
}

/**
 * Функция обрабатывает жесты scroll, pinch to zoom, rotate
 */
export function handleGestures(): void {
  const INITIAL_ZOOM: number = 200;
  const MAX_ZOOM: number = 1000;
  const MIN_ZOOM: number = 100;
  const ZOOM_SPEED: number = 1;
  const INITIAL_BRIGHTNESS: number = 100;
  const MIN_BRIGHTNESS: number = 0;
  const MAX_BRIGHTNESS: number = 500;
  const INITIAL_SCROLL: number = 0;

  const camera: HTMLDivElement | null = document.querySelector('#camera');
  const scrollbar: HTMLDivElement | null = document.querySelector('#scrollbar');
  const zoomIndicator: HTMLParagraphElement | null = document.querySelector('.camera__zoom');
  const brightnessIndicator: HTMLParagraphElement | null = document.querySelector('.camera__brightness');
  const resetZoom: HTMLButtonElement | null = document.querySelector('#reset-zoom');

  if (!camera) return;

  camera.addEventListener('dblclick', () => {
    window.open('pointer-lock.html', '_blank');
  });

  const currentGestures: ICurrentGestures = {
    events: [],
    prevPos: null,
    prevDiff: null,
    prevAngle: null,
  };

  /* Начальные значения сдвига, зума и яркости */
  const nodeState: INodeState = {
    zoom: INITIAL_ZOOM,
    scroll: INITIAL_SCROLL,
    brightness: INITIAL_BRIGHTNESS,
  };

  resetZoom && (resetZoom.onclick = () => {
    nodeState.zoom = MIN_ZOOM;
    setZoom(camera, nodeState.zoom);
    nodeState.scroll = 0;
    setScroll(camera, nodeState.scroll);
  });

  camera.addEventListener('pointerdown', (e: PointerEvent) => {
    camera.setPointerCapture(e.pointerId);

    currentGestures.events.push(e);
    camera.addEventListener('pointermove', pointerMoveHandler);
  });

  camera.addEventListener('pointerup', pointerUpHandler);
  camera.addEventListener('pointercancel', pointerUpHandler);
  camera.addEventListener('pointerout', pointerUpHandler);
  camera.addEventListener('pointerleave', pointerUpHandler);

  function pointerUpHandler(e: PointerEvent): void {
    removeEvent(e);
    if (currentGestures.events.length < 2) currentGestures.prevDiff = null;
    if (currentGestures.events.length < 1) currentGestures.prevPos = null;
    if (currentGestures.events.length < 2) currentGestures.prevAngle = null;
  }

  function pointerMoveHandler(e: PointerEvent): void {
    for (let i = 0; i < currentGestures.events.length; i++) {
      if (e.pointerId === currentGestures.events[i].pointerId) {
        currentGestures.events[i] = e;
        break;
      }
    }

    if (currentGestures.events.length === 2) {
      handleTwoTouches(e);
    } else if (currentGestures.events.length === 1) {
      handleOneTouch(e);
    }
  }

  function handleOneTouch(e: PointerEvent): void {
    if (currentGestures.prevPos && camera) {
      const target: EventTarget | null = e.target;
      if (!target) return;
      const maxScrollDistance = camera.clientWidth * nodeState.zoom / 100 - (<HTMLDivElement>target).clientWidth;

      nodeState.scroll += e.x - currentGestures.prevPos;

      if (nodeState.scroll > 0) {
        nodeState.scroll = 0;
      } else if (-nodeState.scroll > maxScrollDistance) {
        nodeState.scroll = -maxScrollDistance;
      }

      e.target && setScroll(e.target, nodeState.scroll, maxScrollDistance);
    }

    currentGestures.prevPos = e.x;
  }

  function handleTwoTouches(e: PointerEvent) {
    if (!camera) return;
    const p1 = { x: currentGestures.events[0].clientX, y: currentGestures.events[0].clientY };
    const p2 = { x: currentGestures.events[1].clientX, y: currentGestures.events[1].clientY };
    const curDiff = getDistance(p1, p2);
    const curAngle = getAngle(p1, p2);

    const target = <HTMLDivElement>e.target;
    if (currentGestures.prevDiff) {
      nodeState.zoom += (curDiff - currentGestures.prevDiff) * ZOOM_SPEED;

      if (nodeState.zoom > MAX_ZOOM) {
        nodeState.zoom = MAX_ZOOM;
      } else if (nodeState.zoom < MIN_ZOOM) {
        nodeState.zoom = MIN_ZOOM;
      }

      const maxScrollDistance = camera.clientWidth * nodeState.zoom / 100 - target.clientWidth;
      setZoom(target, nodeState.zoom, maxScrollDistance);
    }

    if (currentGestures.prevAngle && Math.abs(curAngle - currentGestures.prevAngle) < 100) {
      nodeState.brightness -= curAngle - currentGestures.prevAngle;

      if (nodeState.brightness > MAX_BRIGHTNESS) {
        nodeState.brightness = MAX_BRIGHTNESS;
      } else if (nodeState.brightness < MIN_BRIGHTNESS) {
        nodeState.brightness = MIN_BRIGHTNESS;
      }

      setBrightness(target, nodeState.brightness);
    }

    currentGestures.prevDiff = curDiff;
    currentGestures.prevAngle = curAngle;
  }

  function removeEvent(e: PointerEvent): void {
    for (let i = 0; i < currentGestures.events.length; i++) {
      if (currentGestures.events[i].pointerId === e.pointerId) {
        currentGestures.events.splice(i, 1);
        break;
      }
    }
  }

  function setScroll(el: EventTarget, scroll: number, maxScrollDistance: number | null = null): void {
    const target = <HTMLDivElement>el;
    target.style.backgroundPositionX = `${scroll}px`;
    if (scrollbar && maxScrollDistance) {
      scrollbar.style.left = `${(-scroll * 100) / maxScrollDistance}%`;
    }
  }

  function setZoom(el: EventTarget, zoom: number, maxScrollDistance: number | null = null): void {
    const target = <HTMLDivElement>el;
    target.style.backgroundSize = `${zoom}%`;
    zoomIndicator && (zoomIndicator.innerText = `Приближение: ${Math.round(zoom)}%`);

    if (zoom === MIN_ZOOM && scrollbar) {
      scrollbar.style.display = 'none';
    } else if (scrollbar && scrollbar.style.display === 'none') {
      scrollbar.style.display = 'block';
    }
    /* При уменьшении размера, если картинка смещена вправо — свдигаем,
    чтобы картинка не выходила за пределы поля видимости. */
    const BgPosition: string | null = target.style.backgroundPositionX;
    if (BgPosition && maxScrollDistance && -parseFloat(BgPosition) > maxScrollDistance) {
      target.style.backgroundPositionX = `${-maxScrollDistance}px`;
    }
  }

  function setBrightness(el: HTMLDivElement, brightness: number): void {
    el.style.filter = `brightness(${brightness}%)`;
    brightnessIndicator && (brightnessIndicator.innerText = `Яркость: ${Math.round(brightness)}%`);
  }

  function getAngle(p1: IPoint, p2: IPoint): number {
    const rad = Math.atan2(p2.x - p1.x, p2.y - p1.y);
    const grad: number = rad * 180 / Math.PI;
    return grad;
  }

  function getDistance(p1: IPoint, p2: IPoint): number {
    const pow1: number = Math.abs(p2.x - p1.x) ** 2;
    const pow2: number = Math.abs(p2.y - p1.y) ** 2;
    return Math.sqrt(pow1 + pow2);
  }
}
