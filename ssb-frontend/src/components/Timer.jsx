import { useState, useEffect, useCallback } from 'react';

function Timer({ seconds, onComplete, paused = false }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (paused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, timeLeft, onComplete]);

  const formatTime = useCallback((secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="test-timer">
      {formatTime(timeLeft)}
    </div>
  );
}

export default Timer;
