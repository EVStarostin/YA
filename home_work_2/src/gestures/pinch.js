setTimeout(handlePinch, 1000);

function handlePinch() {
  const PICTURE_WIDTH = 1664;
  console.log('touch initialized');

  let currentGestures = [
    {
      pointerId: 666,
      startX: 132,
      prevX: 132,
      prevTs: Date.now(),
      startPosition: 0
    }
  ];
  const nodeState = {
    startPosition: 0
  };

  const img = document.querySelector('.event__pic-img');
  img.addEventListener('pointerdown', (e) => {
    img.setPointerCapture(e.pointerId);

    currentGestures.push({
      pointerId: e.pointerId,
      startX: e.x,
      prevX: e.x,
      prevTs: Date.now(),
      startPosition: nodeState.startPosition
    });

    console.log(currentGestures);

    img.addEventListener('pointermove', moveHandler);
  })

  function moveHandler(e) {
    const IMG_WIDTH = 1664;
    const FRAME_WIDTH = e.target.clientWidth;
    const curGest = currentGestures.find(gest => gest.pointerId === e.pointerId);

    if (currentGestures.length !== 2) {
      return;
    } else {
      console.log('2 пальца');
    }

    const { startX1, prevX1, prevTs1, startPosition1 } = currentGestures[0];
    const { startX2, prevX2, prevTs2, startPosition2 } = currentGestures[1];
    // const { x } = e;
    // const dx = x - startX;
    

    const ts = Date.now();

    


    currentGestures.prevX = x;
    currentGestures.prevTs = ts

    nodeState.startPosition = startPosition + dx;
  }

  img.addEventListener('pointerup', (e) => {
    currentGestures = currentGestures.filter(gest => gest.pointerId !== e.pointerId);
    console.log(currentGestures);
  });
}