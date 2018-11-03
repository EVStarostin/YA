import { handleFullScreenVideo } from "Components/Camera";
import Hls from "hls.js";
import { store } from "Store/index";

const URL = "http://194.87.239.193";
const videoURLs = [
  `${URL}:9191/master?url=${URL}:3102/streams/sosed/master.m3u8`,
  `${URL}:9191/master?url=${URL}:3102/streams/cat/master.m3u8`,
  `${URL}:9191/master?url=${URL}:3102/streams/dog/master.m3u8`,
  `${URL}:9191/master?url=${URL}:3102/streams/hall/master.m3u8`,
];

const contentNode = document.querySelector<HTMLDivElement>(".content__wrapper");

export function renderCamerasList(urls: string[], content: HTMLDivElement) {
  content.classList.add("content__wrapper_video");

  const camerasTemplate = document.querySelector<HTMLTemplateElement>("#cameras-template");

  if (!camerasTemplate) { return; }
  const cameraNode = camerasTemplate.content.querySelector<HTMLLIElement>(".cameras__item");
  if (!cameraNode) { return; }

  const camerasList = document.createElement("ul");
  camerasList.classList.add("cameras");
  content.appendChild(camerasList);

  urls.forEach((url, idx) => {
    const cameraClone = document.importNode(cameraNode, true);
    const vid = cameraClone.querySelector<HTMLVideoElement>(".cameras__video");
    if (vid) {
      vid.id = "video-" + (idx + 1);
      initVideo(vid, url);
    }

    camerasList.appendChild(cameraClone);
  });

  const controlsNode = camerasTemplate.content.querySelector<HTMLDivElement>(".controls");
  if (controlsNode) {
    const controlsClone = document.importNode(controlsNode, true);
    content.appendChild(controlsClone);
  }
}

function initVideo(video: HTMLVideoElement, url: string) {
  if (!video) { return; }
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
    store.subscribe(() => {
      const state = store.getState();
      if ( state.page && state.page !== "cameras") { hls.destroy(); }
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
  }
}

export function renderCamerasPage() {
  if (!contentNode) { return; }
  contentNode.innerHTML = "";
  renderCamerasList(videoURLs, contentNode);
  handleFullScreenVideo();
}
