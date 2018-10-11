import 'normalize.css';
import 'pepjs';

import { defineTouchDevice } from 'Components/Layout';
import { handleToggleMenu } from 'Components/Header';
import { generateContent } from 'Components/EventsList';
import { truncateHeaders, handleGestures } from 'Components/Event';
import 'Components/Footer';
import 'Components/PointerLock';
import { initAllVideos } from 'Components/CamerasList';
import { handleFullScreenVideo } from 'Components/Camera';

defineTouchDevice();
handleToggleMenu();
initAllVideos();
handleFullScreenVideo();

generateContent()
  .then(() => {
    truncateHeaders();
    handleGestures();
  })
  .catch((err) => console.error(err));