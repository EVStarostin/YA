export function handleFullScreenVideo() {
  if (!document.querySelector('.cameras')) return;
  const videoContainers = document.querySelectorAll('.cameras__item');

  videoContainers.forEach((item) => {
    item.addEventListener('click', (e) => {
      /* Показывать модальное окно по клику на видео */
      openFullScreen(item);
    });
  });

  document.querySelector('.controls__all-cameras').addEventListener('click', (e) => {
    /* Скрывать модальное окно по клику на кнопку все камеры */
    closeFullScreen();
  })

  function openFullScreen(videoContainer) {
    const video = videoContainer.querySelector('.cameras__video');

    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    modal.style.opacity = '1';
    videoContainer.classList.add('cameras__item_fullscreen');

    const { clientWidth: viewportWidth, clientHeight: viewportHeight } = document.documentElement;
    const viewportCenter = { x: viewportWidth / 2, y: viewportHeight / 2 };

    const { clientWidth: clickedElementWidth, clientHeight: clickedElementHeight } = videoContainer;
    const clickedElementCenter = {
      x: videoContainer.offsetLeft + clickedElementWidth / 2,
      y: videoContainer.offsetTop + clickedElementHeight / 2
    };
    const transform = {
      translate: {
        x: viewportCenter.x - clickedElementCenter.x,
        y: viewportCenter.y - clickedElementCenter.y,
      },
      scale: Math.min(viewportWidth / clickedElementWidth, viewportHeight / clickedElementHeight)
    };

    videoContainer.style.transform = `
      translate(${transform.translate.x}px, ${transform.translate.y}px) scale(${transform.scale})
    `;

    document.body.classList.add('body_fullscreen');
    video.muted = false;

    /* Фильтры яркости и контрастности */
    let filter = { brightness: 100, contrast: 100 };
    document.getElementById('brightness').addEventListener('input', (e) => {
      const videoContainer = document.querySelector('.cameras__item_fullscreen');
      const video = videoContainer.querySelector('.cameras__video');
      filter.brightness = e.target.value;
      video.style.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%)`;
    });

    document.getElementById('contrast').addEventListener('input', (e) => {
      const videoContainer = document.querySelector('.cameras__item_fullscreen');
      const video = videoContainer.querySelector('.cameras__video');
      filter.contrast = e.target.value;
      video.style.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%)`;
    });

    /* Нарисовать анализатор звука web audio api на Canvas */
    createSoundAnalyzer(video);
  }

  function closeFullScreen() {
    const videoContainer = document.querySelector('.cameras__item_fullscreen');
    const video = videoContainer.querySelector('.cameras__video');

    videoContainer.style.transform = 'translate(0) scale(1)';
    document.body.classList.remove('body_fullscreen');
    const modal = document.getElementById('modal');
    modal.style.opacity = '0';
    video.style.filter = 'none';
    video.muted = true;
    document.getElementById('brightness').value = '100';
    document.getElementById('contrast').value = '100';
    setTimeout(() => {
      modal.style.display = 'none';
      videoContainer.classList.remove('cameras__item_fullscreen');
    }, 500);
  }

  let MEDIA_ELEMENT_NODES = {
    ['video-1']: {},
    ['video-2']: {},
    ['video-3']: {},
    ['video-4']: {}
  };

  function createSoundAnalyzer(video) {
    const canvas = document.getElementById('analyzer');
    const canvasCtx = canvas.getContext("2d");

    let audioCtx, analyser, source;
    if (MEDIA_ELEMENT_NODES[video.id].audioCtx) {
      audioCtx = MEDIA_ELEMENT_NODES[video.id].audioCtx;
      analyser = MEDIA_ELEMENT_NODES[video.id].analyser;

      source = MEDIA_ELEMENT_NODES[video.id].source;
      source.connect(analyser);
      source.connect(audioCtx.destination);
    } else {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      MEDIA_ELEMENT_NODES[video.id].audioCtx = audioCtx;

      analyser = audioCtx.createAnalyser();
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;
      MEDIA_ELEMENT_NODES[video.id].analyser = analyser;

      source = audioCtx.createMediaElementSource(video);
      MEDIA_ELEMENT_NODES[video.id].source = source;

      source.connect(analyser);
      source.connect(audioCtx.destination);
    }
    visualize();

    function visualize() {
      const { width: WIDTH, height: HEIGHT } = canvas;

      analyser.fftSize = 256;
      const bufferLengthAlt = analyser.frequencyBinCount;
      const dataArrayAlt = new Uint8Array(bufferLengthAlt);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      const drawAlt = function () {
        requestAnimationFrame(drawAlt);

        analyser.getByteFrequencyData(dataArrayAlt);

        canvasCtx.fillStyle = 'rgb(250, 220, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        const barWidth = (WIDTH / bufferLengthAlt) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLengthAlt; i++) {
          barHeight = dataArrayAlt[i];

          canvasCtx.fillStyle = 'rgb(250,50,0)';
          canvasCtx.fillRect(x, HEIGHT - barHeight / 4, barWidth, barHeight / 4);

          x += barWidth + 1;
        }
      };

      drawAlt();
    }
  };
}