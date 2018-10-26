import { IClickedElementCenter, IFilter, IMediaElementNode, IMediaElementNodes, ITransform } from "../../models";

export function handleFullScreenVideo(): void {
  const camerasContainer: HTMLUListElement | null = document.querySelector(".cameras");
  if (!camerasContainer) { return; }

  const brightnessControl: HTMLInputElement | null = document.querySelector("#brightness");
  const contrastControl: HTMLInputElement | null = document.querySelector("#contrast");
  const allCamerasBtn: HTMLButtonElement | null = document.querySelector(".controls__all-cameras");
  const modal: HTMLDivElement | null = document.querySelector("#modal");
  if (!brightnessControl || !contrastControl || !allCamerasBtn || !modal) { return; }
  let lightAnalyzingCanvas: HTMLCanvasElement | null;
  let openedVideoContainer: HTMLLIElement | null;
  let soundAnalyzerReqAnimFrame: number;
  let lightAnalyzerReqAnimFrame: number;

  const videoContainers: NodeListOf<HTMLLIElement> = document.querySelectorAll(".cameras__item");

  videoContainers.forEach((item: HTMLLIElement) => {
    item.addEventListener("click", () => {
      /* Показывать модальное окно по клику на видео */
      openFullScreen(item);
    });
  });

  allCamerasBtn.addEventListener("click", () => {
    /* Скрывать модальное окно по клику на кнопку все камеры */
    closeFullScreen();
  });

  window.addEventListener("resize", () => {
    if (openedVideoContainer) {
      const transform: ITransform | null = calcTransformation(openedVideoContainer);
      if (!transform) { return; }
      openedVideoContainer.style.transform = `
        translate(${transform.translate.x}px, ${transform.translate.y}px) scale(${transform.scale})
      `;
    }
  });

  function openFullScreen(videoContainer: HTMLLIElement): void {
    openedVideoContainer = videoContainer;
    const video: HTMLVideoElement | null = videoContainer.querySelector(".cameras__video");
    if (!video || !modal) { return; }

    modal.style.display = "block";
    modal.style.opacity = "1";
    videoContainer.classList.add("cameras__item_fullscreen");

    const transform: ITransform | null = calcTransformation(videoContainer);
    if (transform) {
      videoContainer.style.transform = `
        translate(${transform.translate.x}px, ${transform.translate.y}px) scale(${transform.scale})
      `;
    }

    document.body.classList.add("body_fullscreen");
    video.muted = false;

    /* Фильтры яркости и контрастности */
    const filter: IFilter = { brightness: 100, contrast: 100 };
    if (brightnessControl) { brightnessControl.addEventListener("input", (e: Event) => {
      filter.brightness = +(e.target as HTMLInputElement).value;
      if (openedVideoContainer) {
        const modalVideo: HTMLVideoElement | null = openedVideoContainer.querySelector(".cameras__video");
        if (modalVideo) {
          modalVideo.style.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%)`;
        }
      }
    });
    }

    if (contrastControl) { contrastControl.addEventListener("input", (e: Event) => {
      filter.contrast = +(e.target as HTMLInputElement).value;
      if (openedVideoContainer) {
        const modalVideo: HTMLVideoElement | null = openedVideoContainer.querySelector(".cameras__video");
        if (modalVideo) {
          modalVideo.style.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%)`;
        }
      }
    });
    }

    /* Установить свойство "display: none" остальным видео, чтобы не перерисовывались */
    setTimeout(() => {
      const selector: string = ".cameras__item:not(.cameras__item_fullscreen) .cameras__video";
      const backVideos: NodeListOf<HTMLVideoElement> = document.querySelectorAll(selector);
      backVideos.forEach((backVideo: HTMLVideoElement) => {
        backVideo.style.display = "none";
      });
    }, 300);

    /* Нарисовать анализатор звука web audio api на Canvas */
    loadSoundAnalyzer(video);
    /* Вывести уровень освещенности */
    lightAnalyzingCanvas = document.createElement("canvas");
    loadLightAnalyzer(video, lightAnalyzingCanvas);
  }

  function closeFullScreen(): void {
    if (!openedVideoContainer) { return; }
    const video: HTMLVideoElement | null = openedVideoContainer.querySelector(".cameras__video");
    if (!video || !modal) { return; }

    openedVideoContainer.style.transform = "translate(0) scale(1)";
    document.body.classList.remove("body_fullscreen");
    modal.style.opacity = "0";
    video.style.filter = "none";
    video.muted = true;
    if (brightnessControl) { brightnessControl.value = "100"; }
    if (contrastControl) { contrastControl.value = "100"; }

    const selector: string = ".cameras__item:not(.cameras__item_fullscreen) .cameras__video";
    const backVideos: NodeListOf<HTMLVideoElement> = document.querySelectorAll(selector);
    backVideos.forEach((backVideo: HTMLVideoElement) => {
      backVideo.style.display = "block";
    });

    setTimeout(() => {
      if (openedVideoContainer) {
        modal.style.display = "none";
        openedVideoContainer.classList.remove("cameras__item_fullscreen");
        openedVideoContainer = null;
      }
    }, 300);
    lightAnalyzingCanvas = null;
    cancelAnimationFrame(soundAnalyzerReqAnimFrame);
    cancelAnimationFrame(lightAnalyzerReqAnimFrame);
  }

  function calcTransformation(videoContainer: HTMLLIElement): ITransform | null {
    if (!videoContainer) { return null; }
    const doc: HTMLElement | null = document.documentElement;
    if (!doc) { return null; }
    const { clientWidth: viewportWidth, clientHeight: viewportHeight } = doc;
    const viewportCenter = { x: viewportWidth / 2, y: viewportHeight / 2 };

    const { clientWidth: clickedElementWidth, clientHeight: clickedElementHeight } = videoContainer;
    const clickedElementCenter: IClickedElementCenter = {
      x: videoContainer.offsetLeft + clickedElementWidth / 2,
      y: videoContainer.offsetTop + clickedElementHeight / 2,
    };
    const transform: ITransform = {
      translate: {
        x: viewportCenter.x - clickedElementCenter.x,
        y: viewportCenter.y - clickedElementCenter.y,
      },
      scale: Math.min(viewportWidth / clickedElementWidth, viewportHeight / clickedElementHeight),
    };

    return transform;
  }

  const mediaElementNodes: IMediaElementNodes = {
    "video-1": { audioCtx: null, analyser: null, source: null },
    "video-2": { audioCtx: null, analyser: null, source: null },
    "video-3": { audioCtx: null, analyser: null, source: null },
    "video-4": { audioCtx: null, analyser: null, source: null },
  };
  function loadSoundAnalyzer(video: HTMLVideoElement): void {
    const canvas: HTMLCanvasElement | null = document.querySelector("#analyzer");
    if (!canvas) { return; }
    const canvasCtx: CanvasRenderingContext2D | null = canvas.getContext("2d");

    let audioCtx: AudioContext | null;
    let analyser: AnalyserNode | null;
    let source: MediaElementAudioSourceNode | null;
    const node: IMediaElementNode | null = mediaElementNodes[video.id];
    if (node && node.audioCtx) {
      audioCtx = node.audioCtx;
      analyser = node.analyser;
      source = node.source;
      if (source && analyser && audioCtx) {
        source.connect(analyser);
        source.connect(audioCtx.destination);
      }
    } else {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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

    function visualize(): void {
      if (!canvas || !analyser || !canvasCtx) { return; }
      const { width: WIDTH, height: HEIGHT } = canvas;

      analyser.fftSize = 256;
      const bufferLengthAlt: number = analyser.frequencyBinCount;
      const dataArrayAlt: Uint8Array = new Uint8Array(bufferLengthAlt);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      function drawAlt(): void {
        if (!analyser || !canvasCtx) { return; }

        soundAnalyzerReqAnimFrame = requestAnimationFrame(drawAlt);

        analyser.getByteFrequencyData(dataArrayAlt);

        canvasCtx.fillStyle = "rgb(250, 220, 0)";
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        const barWidth: number = (WIDTH / bufferLengthAlt) * 2.5;
        let barHeight: number;
        let x: number = 0;

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

  const lightOutput: HTMLDivElement | null = document.querySelector("#room-light");
  function loadLightAnalyzer(video: HTMLVideoElement, canvas: HTMLCanvasElement): void {
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");

    const canvasWidth: number = 10;
    const canvasHeight: number = 10;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    draw(video, context, canvasWidth, canvasHeight);

    function draw(vid: HTMLVideoElement, canv: CanvasRenderingContext2D | null, width: number, height: number): void {
      if (vid.paused || vid.ended || !canv || !lightOutput) { return; }
      canv.drawImage(vid, 0, 0, width, height);

      const { data } = canv.getImageData(0, 0, width, height);

      let sum: number = 0;
      let counter: number = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r: number = data[i];
        const g: number = data[i + 1];
        const b: number = data[i + 2];
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
