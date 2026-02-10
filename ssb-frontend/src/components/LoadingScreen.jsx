import { useState, useEffect } from 'react';

function LoadingScreen({ message = 'Loading test content...' }) {
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  let displayMessage = message;

  if (loadingTime > 5) {
    displayMessage = 'Server is waking up (free hosting). Please wait...';
  }

  if (loadingTime > 12) {
    displayMessage = 'Almost there 🙂 Thanks for your patience.';
  }

  return (
    <div className="test-container">
      <div className="test-content">
        <p className="text-description">{displayMessage}</p>
      </div>
    </div>
  );
}

export default LoadingScreen;