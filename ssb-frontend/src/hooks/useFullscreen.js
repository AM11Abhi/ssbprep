import { useEffect } from 'react';

function useFullscreen() {
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.log('Fullscreen not available');
      }
    };

    enterFullscreen();

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);
}

export default useFullscreen;
