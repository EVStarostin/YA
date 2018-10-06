const IMG_WIDTH = 1664;

setTimeout(handlePinch, 1000);

function handlePinch(e) {
  let gestures = {
    arr: [
      // {
      //   pointerId: 666,
      //   startX: 100,
      //   prevX: 100,
      //   prevTs: Date.now(),
      // }
    ],
    startZoom: null,
    initialDistance: null
  }

  const nodeState = {
    startZoom: 1
  };

  const frame = document.querySelector('.event__pic-img');
  frame.addEventListener('pointerdown', pointerDownHandler);

  function pointerDownHandler(e) {
    frame.setPointerCapture(e.pointerId);

    gestures.startZoom = nodeState.startZoom;
    gestures.arr.push({
      pointerId: e.pointerId,
      startX: e.x,
      prevX: e.x,
      prevTs: Date.now(),
    });

    if (gestures.arr.length === 2) {
      gestures.initialDistance = Math.abs(gestures.arr[0].prevX - e.x);
    } else {
      gestures.initialDistance = gestures.arr.join('; ');
    }
    
    frame.addEventListener('pointermove', pointerMoveHandler);
  }

  function pointerMoveHandler(e) {
    if (gestures.arr.length !== 2) {
      return;
    };

    const curGest = gestures.arr.find(gest => gest.pointerId === e.pointerId);
    const secondGest = gestures.arr.find(gest => gest !== curGest);
    console.log(Math.abs( (secondGest.prevX - curGest.prevX) - (secondGest.prevX - curGest.prevX - e.x) ));
    const distance = Math.abs(secondGest.prevX - e.x);
    const distanceDif = distance - gestures.initialDistance;
    const zoom = gestures.startZoom + (distanceDif / 100);
    results.innerText = `
      curGest: prevX = ${curGest.prevX} | x = ${e.x}
      secondGest = ${secondGest.prevX}
      distance = ${distance}
      zoom = ${zoom}
      initialDistance = ${gestures.initialDistance}
      ${Math.abs( (secondGest.prevX - curGest.prevX) - (secondGest.prevX - curGest.prevX - e.x) )}
    `;

    document.querySelector('.event__pic-img').style.backgroundSize = `${zoom * 100}%`;
    nodeState.startZoom = zoom;
    console.log('startZoom', gestures.startZoom);

    curGest.prevX = e.x;
  }

  /* При поднятии пальца удалять событие из массива. */
  frame.addEventListener('pointerup', (e) => {
    gestures.arr = gestures.arr.filter(gest => gest.pointerId !== e.pointerId);
  });
}