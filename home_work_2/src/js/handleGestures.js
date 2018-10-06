import {
  MAX_ZOOM,
  MIN_ZOOM,
  ZOOM_SPEED,
  MIN_BRIGHTNESS,
  MAX_BRIGHTNESS,
  INITIAL_ZOOM,
  INITIAL_BRIGHTNESS } from './constants';
import { getDistance, getAngle } from './utils';

export default function handleGestures() {
  const touchableArea = document.querySelector('.event__pic-img');

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

  document.querySelector('.event__pic-reset-zoom-btn').onclick = (e) => {
    nodeState.zoom = INITIAL_ZOOM;
    touchableArea.style.backgroundPositionX = INITIAL_ZOOM;
  };

  touchableArea.addEventListener('pointerdown', e => {
    touchableArea.setPointerCapture(e.pointerId);

    currentGestures.events.push(e);
    touchableArea.addEventListener('pointermove', pointerMoveHandler);
  });

  touchableArea.addEventListener('pointerup', pointerUpHandler);
  touchableArea.addEventListener('pointercancel', pointerUpHandler);
  touchableArea.addEventListener('pointerout', pointerUpHandler);
  touchableArea.addEventListener('pointerleave', pointerUpHandler);

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
      const maxScrollDistance = touchableArea.clientWidth * nodeState.zoom / 100 - e.target.clientWidth;

      nodeState.scroll += e.x - currentGestures.prevPos;

      if (nodeState.scroll > 0) {
        nodeState.scroll = 0;
      } else if (-nodeState.scroll > maxScrollDistance) {
        nodeState.scroll = -maxScrollDistance;
      }

      e.target.style.backgroundPositionX = `${nodeState.scroll}px`;
      document.querySelector('.event__pic-scrollbar').style.left = `${(-nodeState.scroll * 100) / maxScrollDistance}%`;
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
        document.querySelector('.event__pic-scrollbar').style.display = 'none';
      } else {
        document.querySelector('.event__pic-scrollbar').style.display = 'block';
      }

      e.target.style.backgroundSize = `${nodeState.zoom}%`;
      document.querySelector('.event__pic-zoom').innerText = `Приближение: ${Math.round(nodeState.zoom)}%`;

      /* При уменьшении размера, если картинка смещена вправо — свдигаем,
      чтобы картинка не выходила за пределы поля видимости. */ 
      const maxScrollDistance = touchableArea.clientWidth * nodeState.zoom / 100 - e.target.clientWidth;
      if (-parseFloat(e.target.style.backgroundPositionX) > maxScrollDistance) {
        e.target.style.backgroundPositionX = `${-maxScrollDistance}px`;
      }
    }

    if (currentGestures.prevAngle) {
      nodeState.brightness -= curAngle - currentGestures.prevAngle;

      if (nodeState.brightness > MAX_BRIGHTNESS) {
        nodeState.brightness = MAX_BRIGHTNESS;
      } else if (nodeState.brightness < MIN_BRIGHTNESS) {
        nodeState.brightness = MIN_BRIGHTNESS;
      }

      e.target.style.filter = `brightness(${nodeState.brightness}%)`;
      document.querySelector('.event__pic-brightness').innerText = `Яркость: ${Math.round(nodeState.brightness)}%`;
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
}


