import "normalize.css";
import "pepjs";

import { generateContent } from "../src/components//EventsList";
import { handleFullScreenVideo } from "../src/components/Camera";
import { initAllVideos } from "../src/components/CamerasList";
import { handleGestures, truncateHeaders } from "../src/components/Event";
import "../src/components/Footer";
import { handleToggleMenu } from "../src/components/Header";
import { defineTouchDevice } from "../src/components/Layout";
import "../src/components/PointerLock";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    defineTouchDevice();
    handleToggleMenu();
    initAllVideos();
    handleFullScreenVideo();
    await generateContent();
    truncateHeaders();
    handleGestures();
  } catch (error) {
    console.error(error);
  }
});
