import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../../components/Timer.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import MockDataIndicator from '../../components/MockDataIndicator.jsx';
import useFullscreen from '../../hooks/useFullscreen.js';
import usePreventBack from '../../hooks/usePreventBack.js';
import { USE_MOCK_DATA, MOCK_TAT_DATA } from '../../data/mockTestData.js';

const OBSERVE_SECONDS = 30;
const WRITE_SECONDS = 240;

function TATTest() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('observe');
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  useFullscreen();
  usePreventBack(() => setShowDialog(true));

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('http://localhost:3000/content/tat');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setSlides(data.slides || data);
        setLoading(false);
      } catch (err) {
        // TEMP MOCK DATA — REMOVE WHEN BACKEND IS RUNNING
        if (USE_MOCK_DATA) {
          setSlides(MOCK_TAT_DATA.items);
          setUsingMock(true);
          setLoading(false);
        } else {
          setError('Could not load test content. Please try again.');
          setLoading(false);
        }
      }
    };
    fetchSlides();
  }, []);

  const handlePhaseComplete = useCallback(() => {
    if (phase === 'observe') {
      setPhase('write');
    } else {
      if (currentIndex < slides.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setPhase('observe');
      } else {
        navigate('/completed');
      }
    }
  }, [phase, currentIndex, slides.length, navigate]);

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

  const currentSlide = slides[currentIndex];
  const isBlank = currentSlide?.isBlank;

  return (
    <div className="test-container">
      <MockDataIndicator usingMock={usingMock} />
      <div className="test-header">
        <button className="btn btn-ghost" onClick={() => setShowDialog(true)}>
          ← Back
        </button>
        <Timer 
          key={`${currentIndex}-${phase}`}
          seconds={phase === 'observe' ? OBSERVE_SECONDS : WRITE_SECONDS} 
          onComplete={handlePhaseComplete}
          paused={showDialog}
        />
        <div className="test-progress">
          {currentIndex + 1} / {slides.length}
        </div>
      </div>

      <div className="test-content">
        <div className="test-phase-label">
          {phase === 'observe' ? 'Observe' : 'Write your story'}
        </div>
        
        {phase === 'observe' ? (
          isBlank ? (
            <div className="test-word">blank slide</div>
          ) : usingMock ? (
            <div className="test-word" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
              [Image: {currentSlide?.code}]
              <br />
              <span style={{ fontSize: '1rem' }}>(Placeholder - actual image from backend)</span>
            </div>
          ) : (
            <img 
              src={`/tat/${currentSlide?.code || currentSlide?.image}.jpg`}
              alt={`TAT Picture ${currentIndex + 1}`}
              className="test-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )
        ) : (
          <div className="test-word" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
            Write your story on paper
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDialog}
        onContinue={() => setShowDialog(false)}
        onExit={handleExit}
      />
    </div>
  );
}

export default TATTest;
