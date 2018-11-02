declare global {
  interface HTMLDivElement {
    requestPointerLock: () => void;
  }

  interface Document {
    pointerLockElement: HTMLElement;
  }
}

export const PointerLock = (): void => {
  const block: HTMLDivElement | null = document.querySelector(".PointerLock__block");
  if (!block) { return; }
  block.onclick = () => {
    block.requestPointerLock();
  };

  document.addEventListener("pointerlockchange", lockStatusChange, false);

  function lockStatusChange(): void {
    if (document.pointerLockElement === block) {
      document.addEventListener("mousemove", updateCirclePosition, false);
    } else {
      document.removeEventListener("mousemove", updateCirclePosition, false);
    }
  }

  let x = 0;
  function updateCirclePosition(e: MouseEvent): void {
    x += e.movementX;
    if (block) {
      block.style.backgroundPositionX = `${x}px`;
    }
  }
};
