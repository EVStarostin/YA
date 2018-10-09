export default function openVideoFullScreen(e) {
  initVideo(
    document.getElementById('video-modal'),
    e.target.dataset.source
  );

  const viewportCenter = {
    x: document.documentElement.clientWidth / 2,
    y: document.documentElement.clientHeight / 2
  };
  const clickedElementCenter = {
    x: e.target.getBoundingClientRect().left + e.target.clientWidth / 2,
    y: e.target.getBoundingClientRect().top + e.target.clientHeight / 2
  };
  const translation = {
    x: clickedElementCenter.x - viewportCenter.x,
    y: clickedElementCenter.y - viewportCenter.y
  };

  modal.style.transform = `translate(${translation.x}px, ${translation.y}px) scale(0)`;
  modal.classList.add('modal_visible');
  setTimeout(()=>{
    modal.style.transform = 'translate(0) scale(1)';
  }, 10);
}
