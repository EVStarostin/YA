
export function initAllVideos() {
  const URL = 'http://194.87.239.193';
  if (!document.querySelector('.cameras')) return;
  
  initVideo(
    document.getElementById('video-1'),
    `${URL}:9191/master?url=${URL}:3102/streams/sosed/master.m3u8`
  );
  initVideo(
    document.getElementById('video-2'),
    `${URL}:9191/master?url=${URL}:3102/streams/cat/master.m3u8`
  );
  initVideo(
    document.getElementById('video-3'),
    `${URL}:9191/master?url=${URL}:3102/streams/dog/master.m3u8`
  );
  initVideo(
    document.getElementById('video-4'),
    `${URL}:9191/master?url=${URL}:3102/streams/hall/master.m3u8`
  );
}

function initVideo(video, url) {
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.addEventListener('loadedmetadata', function () {
      video.play();
    });
  }
}
