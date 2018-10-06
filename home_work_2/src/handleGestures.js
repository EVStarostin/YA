import { MAX_ZOOM, MIN_ZOOM, ZOOM_SPEED } from './constants';
import { getDistance } from './utils';

export default function handleGestures() {
  const touchableArea = document.querySelector('.event__pic-img');
  // вычисляем середину возможного расстояния, на которое скролится картинка для задания начальной позиции
  const centerX = touchableArea.clientWidth / 2;

  let currentGestures = [
    // {
    //   pointerId: 666,
    //   startX: 0,
    //   startY: 0,
    //   prevX: 0,
    //   prevY: 0,
    //   prevTs: Date.now(),
    //   startPosition: 0
    // }
  ];
  const nodeState = {
    startPosition: 0,
    startZoom: 200
  };

  touchableArea.addEventListener('pointerdown', e => {
    touchableArea.setPointerCapture(e.pointerId);

    currentGestures.push({
      pointerId: e.pointerId,
      startX: e.x,
      startY: e.y,
      prevX: e.x,
      prevY: e.y,
      prevTs: Date.now(),
      startPosition: nodeState.startPosition
    });

    currentGestures.startZoom = nodeState.startZoom;

    const p1 = { x: currentGestures[0].prevX, y: currentGestures[0].prevY };
    const p2 = {x: e.x, y: e.y};
    const startDistance = Math.abs(getDistance(p1, p2));
    touchableArea.addEventListener('pointermove', pointerMoveHandler(startDistance));
  });

  /* При поднятии пальца удаляем обработчки на pointermove */
  touchableArea.addEventListener('pointerup', (e) => {
    touchableArea.removeEventListener('pointermove', pointerMoveHandler);
    currentGestures = currentGestures.filter(gesture => gesture.pointerId !== e.pointerId);
  });

  const pointerMoveHandler = (startDistance) => (e) => {
    if (!currentGestures.length) {
      return;
    } else if (currentGestures.length === 2) {
      handleZoom(e, startDistance);
    } else if (currentGestures.length === 1) {
      handleScroll(e);
    }
  }

  function handleScroll(e) {
    const { startX, startPosition } = currentGestures[0];

    const dx = e.x - startX;
    let currentPosition = startPosition + dx;
    const maxScrollDistance = touchableArea.clientWidth * nodeState.startZoom / 100 - e.target.clientWidth;

    if (currentPosition > 0) {
      currentPosition = 0;
    } else if (-currentPosition > maxScrollDistance) {
      currentPosition = -maxScrollDistance;
    }

    e.target.style.backgroundPositionX = `${currentPosition}px`;
    document.querySelector('.event__pic-scrollbar').style.left = `${(-currentPosition * 100) / maxScrollDistance}%`;

    const ts = Date.now();

    currentGestures[0].prevX = e.x;
    currentGestures[0].prevY = e.y;
    currentGestures[0].prevTs = ts;

    nodeState.startPosition = currentPosition;
  }

  function handleZoom(e, startDistance) {
    const curGest = currentGestures.find(gest => gest.pointerId === e.pointerId);
    const secGest = currentGestures.find(gest => gest !== curGest);

    const p1 = {x: secGest.prevX, y: secGest.prevY};
    const p2 = {x: e.x, y: e.y};

    const currentDistance = Math.abs(getDistance(p1, p2));
    let zoom = currentGestures.startZoom + (currentDistance - startDistance) * ZOOM_SPEED;

    if (!isFinite(zoom)) {
      return;
    } else if (zoom > MAX_ZOOM) {
      zoom = MAX_ZOOM;
    } else if (zoom < MIN_ZOOM) {
      zoom = MIN_ZOOM;
      document.querySelector('.event__pic-scrollbar').style.display = 'none';
    } else {
      document.querySelector('.event__pic-scrollbar').style.display = 'block';
    }

    e.target.style.backgroundSize = `${zoom}%`;
    document.querySelector('.event__pic-zoom').innerText = `Приближение: ${Math.round(zoom)}%`;
    
    const maxScrollDistance = touchableArea.clientWidth * nodeState.startZoom / 100 - e.target.clientWidth;
    if (-parseFloat(e.target.style.backgroundPositionX) > maxScrollDistance) {
      e.target.style.backgroundPositionX = `${-maxScrollDistance}px`;
    }

    nodeState.startZoom = zoom;
    curGest.prevX = e.x;
    curGest.prevY = e.y;
  }
}
