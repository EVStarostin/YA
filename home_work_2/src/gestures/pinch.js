const IMG_WIDTH = 1664;

setTimeout(handlePinch, 1000);

function handlePinch(e) {
  let gestures = {
    gests: [],
    startDistance: 0
  }

  const nodeState = {
    startDistance: 0
  };

  const frame = document.querySelector('.event__pic-img');
  frame.addEventListener('pointerdown', pointerDownHandler);

  function pointerDownHandler(e) {
    frame.setPointerCapture(e.pointerId);

    gestures.startZoom = nodeState.startDistance;
    gestures.gests.push({
      pointerId: e.pointerId,
      startX: e.x,
      prevX: e.x,
      prevTs: Date.now(),
    });
    
    frame.addEventListener('pointermove', pointerMoveHandler);
  }

  function pointerMoveHandler(e) {
    if (gestures.gests.length !== 2) {
      return;
    };

    const curGest = gestures.gests.find(gest => gest.pointerId === e.pointerId);
    const secondGest = gestures.gests.find(gest => gest !== curGest);
    console.log(Math.abs(secondGest.prevX - e.x));
    const distance = Math.abs(secondGest.prevX - e.x);
    document.querySelector('.event__pic-img').style.backgroundSize = `${100 + distance / 100}%`;

    curGest.prevX = e.x;
  }

  /* При поднятии пальца удалять событие из массива. */
  frame.addEventListener('pointerup', (e) => {
    gestures.gests = gestures.gests.filter(gest => gest.pointerId !== e.pointerId);
  });
}