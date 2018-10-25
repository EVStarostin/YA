import 'normalize.css';
import 'pepjs';

import { defineTouchDevice } from '../src/components/Layout';
import { handleToggleMenu } from '../src/components/Header';
import { generateContent } from '../src/components//EventsList';
import { truncateHeaders, handleGestures } from '../src/components/Event';
import '../src/components/Footer';
import '../src/components/PointerLock';
import { initAllVideos } from '../src/components/CamerasList';
import { handleFullScreenVideo } from '../src/components/Camera';

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
