import { ClickedElementCenter, Filter, MediaElementNode, MediaElementNodes, Transform } from "Models/Camera";

export function handleFullScreenVideo() {
  const camerasContainer = document.querySelector<HTMLUListElement>(".cameras");
  if (!camerasContainer) { return; }

  const brightnessControl = document.querySelector<HTMLInputElement>("#brightness");
  const contrastControl = document.querySelector<HTMLInputElement>("#contrast");
  const allCamerasBtn = document.querySelector<HTMLButtonElement>(".controls__all-cameras");
  const modal = document.querySelector<HTMLDivElement>("#modal");
  let lightAnalyzingCanvas: HTMLCanvasElement | null;
  let openedVideoContainer: HTMLLIElement | null;
  let soundAnalyzerReqAnimFrame: number;
  let lightAnalyzerReqAnimFrame: number;

  const videoContainers = document.querySelectorAll<HTMLLIElement>(".cameras__item");
  videoContainers.forEach((item) => {
    item.addEventListener("click", () => { openFullScreen(item); });
  });

  if (allCamerasBtn) {
    allCamerasBtn.addEventListener("click", () => { closeFullScreen(); });
  }

  window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
      closeFullScreen();
    }
  });

  window.addEventListener("resize", () => {
    if (openedVideoContainer) {
      const transform = calcTransformation(openedVideoContainer);
      if (!transform) { return; }
      openedVideoContainer.style.transform = `
        translate(${transform.translate.x}px, ${transform.translate.y}px) scale(${transform.scale})
      `;
    }
  });

  function openFullScreen(videoContainer: HTMLLIElement) {
    openedVideoContainer = videoContainer;
    const video = videoContainer.querySelector<HTMLVideoElement>(".cameras__video");
    if (!video) { return; }

    if (modal) {
      modal.style.display = "block";
      modal.style.opacity = "1";
    }

    videoContainer.classList.add("cameras__item_fullscreen");

    const transform = calcTransformation(videoContainer);
    if (transform) {
      videoContainer.style.transform = `
        translate(${transform.translate.x}px, ${transform.translate.y}px) scale(${transform.scale})
      `;
    }

    document.body.classList.add("body_fullscreen");
    video.muted = false;

    /* Фильтры яркости и контрастности */
    const filter: Filter = { brightness: 100, contrast: 100 };
    if (brightnessControl) { brightnessControl.addEventListener("input", (e: Event) => {
      if (e.target) {
        const value = (e.target as HTMLInputElement).value;
        filter.brightness = +value;
      }

      if (openedVideoContainer) {
        const modalVideo = openedVideoContainer.querySelector<HTMLVideoElement>(".cameras__video");
        if (modalVideo) {
          modalVideo.style.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%)`;
        }
      }
    });
    }

    if (contrastControl) { contrastControl.addEventListener("input", (e: Event) => {
      if (e.target) {
        const value = (e.target as HTMLInputElement).value;
        filter.contrast = +value;
      }

      if (openedVideoContainer) {
        const modalVideo = openedVideoContainer.querySelector<HTMLVideoElement>(".cameras__video");
        if (modalVideo) {
          modalVideo.style.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%)`;
        }
      }
    });
    }

    /* Установить свойство "display: none" остальным видео, чтобы не перерисовывались */
    setTimeout(() => {
      const selector = ".cameras__item:not(.cameras__item_fullscreen) .cameras__video";
      const backVideos = document.querySelectorAll<HTMLVideoElement>(selector);
      backVideos.forEach((backVideo) => {
        backVideo.style.display = "none";
      });
    }, 300);

    /* Нарисовать анализатор звука web audio api на Canvas */
    loadSoundAnalyzer(video);
    /* Вывести уровень освещенности */
    lightAnalyzingCanvas = document.createElement("canvas");
    loadLightAnalyzer(video, lightAnalyzingCanvas);
  }

  function closeFullScreen() {
    if (!openedVideoContainer) { return; }
    const video = openedVideoContainer.querySelector<HTMLVideoElement>(".cameras__video");
    if (!video) { return; }

    openedVideoContainer.style.transform = "translate(0) scale(1)";
    document.body.classList.remove("body_fullscreen");
    if (modal) { modal.style.opacity = "0"; }
    video.style.filter = "none";
    video.muted = true;
    if (brightnessControl) { brightnessControl.value = "100"; }
    if (contrastControl) { contrastControl.value = "100"; }

    const selector = ".cameras__item:not(.cameras__item_fullscreen) .cameras__video";
    const backVideos = document.querySelectorAll<HTMLVideoElement>(selector);
    backVideos.forEach((backVideo) => {
      backVideo.style.display = "block";
    });

    setTimeout(() => {
      if (openedVideoContainer) {
        if (modal) { modal.style.display = "none"; }
        openedVideoContainer.classList.remove("cameras__item_fullscreen");
        openedVideoContainer = null;
      }
    }, 300);
    lightAnalyzingCanvas = null;
    cancelAnimationFrame(soundAnalyzerReqAnimFrame);
    cancelAnimationFrame(lightAnalyzerReqAnimFrame);
  }

  function calcTransformation(videoContainer: HTMLLIElement): Transform | null {
    if (!videoContainer || !document.documentElement) { return null; }
    const { clientWidth: viewportWidth, clientHeight: viewportHeight } = document.documentElement;
    const viewportCenter = { x: viewportWidth / 2, y: viewportHeight / 2 };

    const { clientWidth: clickedElementWidth, clientHeight: clickedElementHeight } = videoContainer;
    const clickedElementCenter: ClickedElementCenter = {
      x: videoContainer.offsetLeft + clickedElementWidth / 2,
      y: videoContainer.offsetTop + clickedElementHeight / 2,
    };
    const transform: Transform = {
      translate: {
        x: viewportCenter.x - clickedElementCenter.x,
        y: viewportCenter.y - clickedElementCenter.y,
      },
      scale: Math.min(viewportWidth / clickedElementWidth, viewportHeight / clickedElementHeight),
    };

    return transform;
  }

  const mediaElementNodes: MediaElementNodes = {
    "video-1": { audioCtx: null, analyser: null, source: null },
    "video-2": { audioCtx: null, analyser: null, source: null },
    "video-3": { audioCtx: null, analyser: null, source: null },
    "video-4": { audioCtx: null, analyser: null, source: null },
  };
  function loadSoundAnalyzer(video: HTMLVideoElement) {
    const canvas = document.querySelector<HTMLCanvasElement>("#analyzer");
    if (!canvas) { return; }
    const canvasCtx = canvas.getContext("2d");

    let audioCtx: AudioContext | null;
    let analyser: AnalyserNode | null;
    let source: MediaElementAudioSourceNode | null;
    const node = mediaElementNodes[video.id];
    if (node && node.audioCtx) {
      audioCtx = node.audioCtx;
      analyser = node.analyser;
      source = node.source;
      if (source && analyser && audioCtx) {
        source.connect(analyser);
        source.connect(audioCtx.destination);
      }
    } else {
      audioCtx = new (AudioContext || webkitAudioContext)();
      node.audioCtx = audioCtx;
      analyser = audioCtx.createAnalyser();
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;
      node.analyser = analyser;

      source = audioCtx.createMediaElementSource(video);
      node.source = source;

      source.connect(analyser);
      source.connect(audioCtx.destination);
    }
    visualize();

    function visualize() {
      if (!canvas || !analyser || !canvasCtx) { return; }
      const { width: WIDTH, height: HEIGHT } = canvas;

      analyser.fftSize = 256;
      const bufferLengthAlt = analyser.frequencyBinCount;
      const dataArrayAlt = new Uint8Array(bufferLengthAlt);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      function drawAlt() {
        if (!analyser || !canvasCtx) { return; }

        soundAnalyzerReqAnimFrame = requestAnimationFrame(drawAlt);

        analyser.getByteFrequencyData(dataArrayAlt);

        canvasCtx.fillStyle = "rgb(250, 220, 0)";
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        const barWidth = (WIDTH / bufferLengthAlt) * 2.5;
        let barHeight: number;
        let x = 0;

        for (let i = 0; i < bufferLengthAlt; i++) {
          barHeight = dataArrayAlt[i];

          canvasCtx.fillStyle = "rgb(250,50,0)";
          canvasCtx.fillRect(x, HEIGHT - barHeight / 4, barWidth, barHeight / 4);

          x += barWidth + 1;
        }
      }

      drawAlt();
    }
  }

  const lightOutput = document.querySelector<HTMLDivElement>("#room-light");
  function loadLightAnalyzer(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");

    const canvasWidth = 10;
    const canvasHeight = 10;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    draw(video, context, canvasWidth, canvasHeight);

    function draw(vid: HTMLVideoElement, canv: CanvasRenderingContext2D | null, width: number, height: number) {
      if (vid.paused || vid.ended || !canv || !lightOutput) { return; }
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
      }
      lightOutput.innerText = `${Math.round((sum / counter) * 100 / 255)}%`;
      lightAnalyzerReqAnimFrame = requestAnimationFrame(() => {
        draw(vid, canv, width, height);
      });
    }
  }
}
