export const PointerLock = () => {
  const block = document.querySelector('.PointerLock__block');
  if (!block) return;
  block.onclick = function () {
    block.requestPointerLock();
  }

  document.addEventListener('pointerlockchange', lockStatusChange, false);

  function lockStatusChange() {
    if (document.pointerLockElement === block) {
      document.addEventListener("mousemove", updateCirclePosition, false);
    }
    else {
      document.removeEventListener("mousemove", updateCirclePosition, false);
    }
  }

  let x = 0;
  function updateCirclePosition(e) {
    x += e.movementX;
    block.style.backgroundPositionX = `${x}px`;
  }
}
