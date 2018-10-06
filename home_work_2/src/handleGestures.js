import { TOUCH_IMG_WIDTH } from './constants';

export default function handleGestures() {
  const touchableArea = document.querySelector('.event__pic-img');

  let currentGestures = [];
  const nodeState = {
    startPosition: -(TOUCH_IMG_WIDTH - touchableArea.clientWidth) / 2
  };

  touchableArea.addEventListener('pointerdown', e => {
    touchableArea.setPointerCapture(e.pointerId);

    currentGestures.push({
      pointerId: e.pointerId,
      startX: e.x,
      prevX: e.x,
      prevTs: Date.now(),
      startPosition: nodeState.startPosition
    });

    touchableArea.addEventListener('pointermove', pointerMoveHandler);
  });

  /* При поднятии пальца удаляем обработчки на pointermove */
  touchableArea.addEventListener('pointerup', (e) => {
    touchableArea.removeEventListener('pointermove', pointerMoveHandler);
    currentGestures = currentGestures.filter(gesture => gesture.pointerId !== e.pointerId);
  });

  function pointerMoveHandler(e) {
    if (!currentGestures.length) {
      return;
    } else if (currentGestures.length === 1) {
      handleScroll(e);
    }
  }

  function handleScroll(e) {
    const { startX, prevX, prevTs, startPosition } = currentGestures[0];
    const { x, target } = e;
    const dx = x - startX;
    let currentPosition = startPosition + dx;
    const maxScrollDistance = TOUCH_IMG_WIDTH - target.clientWidth;

    if (currentPosition > 0) {
      currentPosition = 0;
    } else if (-currentPosition > maxScrollDistance) {
      currentPosition = -maxScrollDistance;
    }

    target.style.backgroundPositionX = `${currentPosition}px`;
    document.querySelector('.event__pic-scrollbar').style.left = `${(-currentPosition * 100) / maxScrollDistance}%`;

    const ts = Date.now();

    currentGestures[0].prevX = x;
    currentGestures[0].prevTs = ts

    nodeState.startPosition = currentPosition;
  }
}