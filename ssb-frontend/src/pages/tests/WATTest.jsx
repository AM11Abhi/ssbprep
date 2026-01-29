import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../../components/Timer.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import MockDataIndicator from '../../components/MockDataIndicator.jsx';
import useFullscreen from '../../hooks/useFullscreen.js';
import usePreventBack from '../../hooks/usePreventBack.js';
import { USE_MOCK_DATA, MOCK_WAT_DATA } from '../../data/mockTestData.js';

const SECONDS_PER_WORD = 15;

function WATTest() {
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  useFullscreen();
  usePreventBack(() => setShowDialog(true));

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('http://localhost:3000/content/wat');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setWords(data.words || data);
        setLoading(false);
      } catch (err) {
        // TEMP MOCK DATA — REMOVE WHEN BACKEND IS RUNNING
        if (USE_MOCK_DATA) {
          const mockWords = MOCK_WAT_DATA.items.map(item => item.word);
          setWords(mockWords);
          setUsingMock(true);
          setLoading(false);
        } else {
          setError('Could not load test content. Please try again.');
          setLoading(false);
        }
      }
    };
    fetchWords();
  }, []);

  const handleWordComplete = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigate('/completed');
    }
  }, [currentIndex, words.length, navigate]);

  const handleExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    navigate('/practice');
  };

  if (loading) {
    return (
      <div className="test-container">
        <div className="test-content">
          <p className="text-description">Loading test content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-container">
        <div className="test-content">
          <p className="text-description">{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/practice')}>
            Return to Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-container">
      <MockDataIndicator usingMock={usingMock} />
      <div className="test-header">
        <button className="btn btn-ghost" onClick={() => setShowDialog(true)}>
          ← Back
        </button>
        <Timer 
          key={currentIndex}
          seconds={SECONDS_PER_WORD} 
          onComplete={handleWordComplete}
          paused={showDialog}
        />
        <div className="test-progress">
          {currentIndex + 1} / {words.length}
        </div>
      </div>

      <div className="test-content">
        <div className="test-word">
          {words[currentIndex]}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDialog}
        onContinue={() => setShowDialog(false)}
        onExit={handleExit}
      />
    </div>
  );
}

export default WATTest;
