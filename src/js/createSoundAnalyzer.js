let MEDIA_ELEMENT_NODES = {};
MEDIA_ELEMENT_NODES['video-1'] = {};
MEDIA_ELEMENT_NODES['video-2'] = {};
MEDIA_ELEMENT_NODES['video-3'] = {};
MEDIA_ELEMENT_NODES['video-4'] = {};

export default function createSoundAnalyzer(video) {
  // set up canvas context for visualizer
  const canvas = document.getElementById('analyzer');
  const canvasCtx = canvas.getContext("2d");

  // set up forked web audio context, for multiple browsers
  // window. is needed otherwise Safari explodes
  // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  //set up the different audio nodes we will use for the app
  // const analyser = audioCtx.createAnalyser();
  // analyser.minDecibels = -90;
  // analyser.maxDecibels = -10;
  // analyser.smoothingTimeConstant = 0.85;


  //main block for doing the audio recording
  // const video = document.querySelector('.cameras__item_fullscreen .cameras__video');
  // const source = audioCtx.createMediaElementSource(video);
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
