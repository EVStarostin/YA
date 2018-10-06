setTimeout(handlePinch, 1000);

function handlePinch() {
  const PICTURE_WIDTH = 1664;
  console.log('touch initialized');

  let currentGestures = {
    gests: [{
      pointerId: 666,
      startX: 1000,
      prevX: 1000,
      prevTs: Date.now(),
    }],
    startZoom: 0
  }

  const nodeState = {
    startZoom: 0
  };

  const img = document.querySelector('.event__pic-img');
  img.addEventListener('pointerdown', (e) => {
    img.setPointerCapture(e.pointerId);

    currentGestures.startZoom = Math.abs(nodeState.startZoom + );
    currentGestures.gests.push({
      pointerId: e.pointerId,
      startX: e.x,
      prevX: e.x,
      prevTs: Date.now(),
    });

    console.log(currentGestures);

    img.addEventListener('pointermove', moveHandler);
  })

  function moveHandler(e) {
    const IMG_WIDTH = 1664;
    const FRAME_WIDTH = e.target.clientWidth;
    const curGest = currentGestures.gests.find(gest => gest.pointerId === e.pointerId);

    if (currentGestures.gests.length !== 2) {
      return;
    } else {
      console.log('2 пальца');
    }

    const { startX: startX1, prevX: prevX1, prevTs: prevTs1 } = currentGestures.gests[0];
    const { startX: startX2, prevX: prevX2, prevTs: prevTs2 } = currentGestures.gests[1];
    const { x } = e;
    const dx = (prevX2 - prevX1) - (x - prevX1);
    results.innerText = `
      dx = ${dx} 
      prevX2 - prevX1 = ${Math.abs(prevX1 - x)}
      x = ${x}
    `;

    nodeState.startZoom = currentGestures.startZoom + dx;
    console.log('zoom', nodeState.startZoom);

    const ts = Date.now();

    curGest.prevX = x;
    curGest.prevTs = ts;

  }

  img.addEventListener('pointerup', (e) => {
    currentGestures.gests = currentGestures.gests.filter(gest => gest.pointerId !== e.pointerId);
    console.log(currentGestures);
  });
}