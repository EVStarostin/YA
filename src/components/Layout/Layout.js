export function defineTouchDevice() {
  if ('ontouchstart' in window) {
    document.body.classList.add('touch');
  }
}
