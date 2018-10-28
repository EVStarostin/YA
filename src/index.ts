import "normalize.css";
import "pepjs";

import { generateContent } from "Components//EventsList";
import { handleFullScreenVideo } from "Components/Camera";
import { initAllVideos } from "Components/CamerasList";
import { handleGestures, truncateHeaders } from "Components/Event";
import "Components/Footer";
import { handleToggleMenu } from "Components/Header";
import { defineTouchDevice } from "Components/Layout";
import "Components/PointerLock";

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
