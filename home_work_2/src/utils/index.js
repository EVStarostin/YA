export function setMaxHeightForTruncate() {
  setTimeout(() => {
    const truncatedStrings = document.querySelectorAll('.event__title');
    truncatedStrings.forEach(item => {
      const maxHeight = parseFloat(getComputedStyle(item).lineHeight) * 2;
      if (item.scrollHeight - maxHeight > 5) item.classList.add('event__title_truncated');
      item.style.maxHeight = `${maxHeight}px`;
    });
  }, 100);
}

export function isTouchDevice() {
  return 'ontouchstart' in window;
}

export function isTemplateSupported() {
  return 'content' in document.createElement('template');
}
