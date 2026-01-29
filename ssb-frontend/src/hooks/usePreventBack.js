import { useEffect } from 'react';

function usePreventBack(showDialog) {
  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      showDialog();
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showDialog]);
}

export default usePreventBack;
