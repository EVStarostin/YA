setTimeout(run, 1000);

function run() {
  const PICTURE_WIDTH = 1664;
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

    cam.addEventListener('pointermove', handler);
  });

  function handler(e) {
    const blockWidth = e.target.clientWidth;
    if (!currentGesture) {
      return;
    };

    const { startX, prevX, prevTs, startPosition } = currentGesture;
    const { x } = e;
    const dx = x - startX;

    console.log();

    if (startPosition + dx > 0) {
      document.querySelector('.event__pic-zoom').innerText = 0;
      document.querySelector('.event__pic-brightness').innerText = 0;
      cam.style.backgroundPositionX = '0';
      document.querySelector('.event__pic-scrollbar').value = 0;
      return;
    } else if (Math.abs(startPosition + dx) > PICTURE_WIDTH - blockWidth) {
      document.querySelector('.event__pic-zoom').innerText = 0;
      document.querySelector('.event__pic-brightness').innerText = PICTURE_WIDTH - blockWidth;
      cam.style.backgroundPositionX = PICTURE_WIDTH - blockWidth;
      document.querySelector('.event__pic-scrollbar').value = 100;
      return;
    }

    document.querySelector('.event__pic-zoom').innerText = dx;
    document.querySelector('.event__pic-brightness').innerText = Math.abs(startPosition + dx);
    cam.style.backgroundPositionX = `${startPosition + dx}px`;

    const rangePosition = ((startPosition + dx) * 100 ) / (PICTURE_WIDTH - e.target.clientWidth);
    document.querySelector('.event__pic-scrollbar').value = -rangePosition;

    const ts = Date.now();

    currentGesture.prevX = x;
    currentGesture.prevTs = ts

    nodeState.startPosition = startPosition + dx;
  }

  cam.addEventListener('pointerup', () => {
    cam.removeEventListener('pointermove', handler);
  });

  document.querySelector('.event__pic-scrollbar').addEventListener('input', function() {
    const blockWidth = document.querySelector('.event__pic-img').clientWidth;
    nodeState.startPosition = -(PICTURE_WIDTH - blockWidth) * this.value / 100;
    console.log(nodeState.startPosition);
    document.querySelector('.event__pic-img').style.backgroundPositionX = `${nodeState.startPosition}px`;
  });
}