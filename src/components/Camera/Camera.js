export function handleFullScreenVideo() {
  const brightnessControl = document.getElementById('brightness');
  const contrastControl = document.getElementById('contrast');
  const allCamerasBtn = document.querySelector('.controls__all-cameras');
  const modal = document.getElementById('modal');
  let openedVideoContainer = null;

  if (!document.querySelector('.cameras')) return;
  const videoContainers = document.querySelectorAll('.cameras__item');

  videoContainers.forEach((item) => {
    item.addEventListener('click', () => {
      /* Показывать модальное окно по клику на видео */
      openFullScreen(item);
    });
  });

  allCamerasBtn.addEventListener('click', () => {
    /* Скрывать модальное окно по клику на кнопку все камеры */
    closeFullScreen();
  });

  window.addEventListener('resize', () => {
    const transform = calcTransformation(openedVideoContainer);
    if (!transform) return;
    openedVideoContainer.style.transform = `
      translate(${transform.translate.x}px, ${transform.translate.y}px) scale(${transform.scale})
    `;
  });

  function openFullScreen(videoContainer) {
    const video = videoContainer.querySelector('.cameras__video');

    modal.style.display = 'block';
    modal.style.opacity = '1';
    videoContainer.classList.add('cameras__item_fullscreen');
    openedVideoContainer = videoContainer;

    const transform = calcTransformation(videoContainer);
    videoContainer.style.transform = `
      translate(${transform.translate.x}px, ${transform.translate.y}px) scale(${transform.scale})
    `;

    document.body.classList.add('body_fullscreen');
    video.muted = false;

    /* Фильтры яркости и контрастности */
    const filter = { brightness: 100, contrast: 100 };
    brightnessControl.addEventListener('input', (e) => {
      filter.brightness = e.target.value;
      openedVideoContainer.querySelector('.cameras__video').style.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%)`;
    });

    contrastControl.addEventListener('input', (e) => {
      filter.contrast = e.target.value;
      openedVideoContainer.querySelector('.cameras__video').style.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%)`;
    });

    /* Нарисовать анализатор звука web audio api на Canvas */
    loadSoundAnalyzer(video);
    /* Вывести уровень освещенности */
    loadLightDetector(video);
  }

  function closeFullScreen() {
    const video = openedVideoContainer.querySelector('.cameras__video');

    openedVideoContainer.style.transform = 'translate(0) scale(1)';
    document.body.classList.remove('body_fullscreen');
    modal.style.opacity = '0';
    video.style.filter = 'none';
    video.muted = true;
    brightnessControl.value = '100';
    contrastControl.value = '100';
    setTimeout(() => {
      modal.style.display = 'none';
      openedVideoContainer.classList.remove('cameras__item_fullscreen');
      openedVideoContainer = null;
    }, 500);
  }

  function calcTransformation(videoContainer) {
    if (!videoContainer) return null;
    const { clientWidth: viewportWidth, clientHeight: viewportHeight } = document.documentElement;
    const viewportCenter = { x: viewportWidth / 2, y: viewportHeight / 2 };

    const { clientWidth: clickedElementWidth, clientHeight: clickedElementHeight } = videoContainer;
    const clickedElementCenter = {
      x: videoContainer.offsetLeft + clickedElementWidth / 2,
      y: videoContainer.offsetTop + clickedElementHeight / 2,
    };
    const transform = {
      translate: {
        x: viewportCenter.x - clickedElementCenter.x,
        y: viewportCenter.y - clickedElementCenter.y,
      },
      scale: Math.min(viewportWidth / clickedElementWidth, viewportHeight / clickedElementHeight),
    };

    return transform;
  }

  const MEDIA_ELEMENT_NODES = {
    'video-1': {},
    'video-2': {},
    'video-3': {},
    'video-4': {},
  };
  function loadSoundAnalyzer(video) {
    const canvas = document.getElementById('analyzer');
    const canvasCtx = canvas.getContext('2d');

    let audioCtx; let analyser; let
      source;
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

      function drawAlt() {
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
      }

      drawAlt();
    }
  }

  const lightOutput = document.getElementById('room-light');
  function loadLightDetector(video) {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas-light';
    const context = canvas.getContext('2d');

    const canvasWidth = video.clientWidth;
    const canvasHeight = video.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    draw(video, context, canvasWidth, canvasHeight);

    function draw(vid, canv, width, height) {
      if (vid.paused || vid.ended) return false;
      canv.drawImage(vid, 0, 0, width, height);

      const { data } = canv.getImageData(0, 0, width, height);

      let sum = 0;
      let counter = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        sum += (r + g + b) / 3;
        counter++;
        const brightness = (3 * r + 4 * g + b) >>> 3;
        data[i] = brightness;
        data[i + 1] = brightness;
        data[i + 2] = brightness;
      }
      lightOutput.innerText = `${Math.round((sum / counter) * 100 / 255)}%`;
      requestAnimationFrame(() => { draw(vid, canv, width, height); }, 0);
    }
  }
}
