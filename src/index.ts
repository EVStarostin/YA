import 'normalize.css';
import 'pepjs';

import { defineTouchDevice } from 'Components/Layout/index';
import { handleToggleMenu } from 'Components/Header/index';
import { generateContent } from 'Components/EventsList/index';
import { truncateHeaders, handleGestures } from 'Components/Event/index';
import 'Components/Footer';
import 'Components/PointerLock';
import { initAllVideos } from 'Components/CamerasList/index';
import { handleFullScreenVideo } from 'Components/Camera/index';

document.addEventListener('DOMContentLoaded', async () => {
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
