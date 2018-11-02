import Hls from "hls.js";

const URL = "http://194.87.239.193";
const videoURLs = [
  `${URL}:9191/master?url=${URL}:3102/streams/sosed/master.m3u8`,
  `${URL}:9191/master?url=${URL}:3102/streams/cat/master.m3u8`,
  `${URL}:9191/master?url=${URL}:3102/streams/dog/master.m3u8`,
  `${URL}:9191/master?url=${URL}:3102/streams/hall/master.m3u8`,
];
const contentWrapper = document.querySelector<HTMLDivElement>(".content__wrapper");

export function renderCamerasList(urls: string[], content: HTMLDivElement) {
  content.classList.add("content__wrapper_video");

  const camerasTemplate = document.querySelector<HTMLTemplateElement>("#cameras-template");

  if (!camerasTemplate) { return; }
  const cameraNode = camerasTemplate.content.querySelector<HTMLLIElement>(".cameras__item");
  if (!cameraNode) { return; }

  const camerasList = document.createElement("ul");
  camerasList.classList.add("cameras");
  content.appendChild(camerasList);

  urls.forEach((url: string, idx: number) => {
    const cameraClone = document.importNode(cameraNode, true);
    const vid = cameraClone.querySelector<HTMLVideoElement>(".cameras__video");
    if (vid) {
      vid.id = "video-" + (idx + 1);
      initVideo(vid, url);
    }

    camerasList.appendChild(cameraClone);
  });
}

function initVideo(video: HTMLVideoElement, url: string): void {
  if (!video) { return; }
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
  }
}

if (contentWrapper) {
  renderCamerasList(videoURLs, contentWrapper);
}
