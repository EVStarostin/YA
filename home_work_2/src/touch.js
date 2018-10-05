setTimeout(run, 1000);

function run() {
  console.log('touch initialized');

  let currentGesture = null;
  const nodeState = {
    startPosition: 0
  };

  const cam = document.querySelector('.event__pic-img');
  cam.addEventListener('pointerdown', e => {
    cam.setPointerCapture(e.pointerId);

    currentGesture = {
      startX: e.x,
      prevX: e.x,
      prevTs: Date.now(),
      startPosition: nodeState.startPosition
    }
  });

  cam.addEventListener('pointermove', e => {
    document.querySelector('.event__pic-zoom').innerText = e.x;
    if (!currentGesture) {
      return;
    };

    const { startX, prevX, prevTs, startPosition } = currentGesture;
    const { x } = e;
    const dx = x - startX;
    document.querySelector('.event__pic-zoom').innerText = startPosition + dx;
    cam.style.backgroundPosition = `${startPosition + dx}px`;

    const ts = Date.now();

    currentGesture.prevX = x;
    currentGesture.prevTs = ts
  });
}