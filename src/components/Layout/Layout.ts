export function defineTouchDevice(): void {
  if ("ontouchstart" in window) {
    document.body.classList.add("touch");
  }
}
