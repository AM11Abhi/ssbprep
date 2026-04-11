import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Timer from '../../components/Timer.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import MockDataIndicator from '../../components/MockDataIndicator.jsx';
import useFullscreen from '../../hooks/useFullscreen.js';
import usePreventBack from '../../hooks/usePreventBack.js';
import { api } from '../../utils/api.js';
import LoadingScreen from '../../components/LoadingScreen.jsx';
import { USE_MOCK_DATA, MOCK_WAT_DATA } from '../../data/mockTestData.js';

const SECONDS_PER_WORD = 15;

function WATTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const isInteractive = location.state?.mode === 'interactive';

  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const completedRef = useRef(false);

  // Interactive mode state
  const [currentInput, setCurrentInput] = useState('');
  const currentInputRef = useRef('');
  const responsesRef = useRef([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useFullscreen();
  usePreventBack(() => setShowDialog(true));

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(api.wat());
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        console.log("WAT res:", data.items);
        setWords(data.items || data);
        setLoading(false);
      } catch (err) {
        // TEMP MOCK DATA — REMOVE WHEN BACKEND IS RUNNING
        if (USE_MOCK_DATA) {
          setWords(MOCK_WAT_DATA.items);
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

  const submitInteractiveTest = useCallback(async (finalResponses) => {
    setIsSubmitting(true);
    try {
      if (finalResponses.length === 0) {
        navigate('/test/wat/complete', { state: { advice: "No responses were provided. Try again and type your sentences.", responses: [] } });
        return;
      }

      const res = await fetch(api.watFeedback(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: finalResponses })
      });

      if (!res.ok) {
        throw new Error('Failed to generate feedback');
      }

      const data = await res.json();
      navigate('/test/wat/complete', { state: { advice: data.advice, responses: finalResponses } });
    } catch (err) {
      console.error("WAT Feedback Error:", err);
      navigate('/test/wat/complete', { 
        state: { 
          advice: "Error generating AI feedback. The server might be rate limited or down. Please review your sentences manually.",
          responses: finalResponses 
        } 
      });
    }
  }, [navigate]);

  const handleWordComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    if (isInteractive) {
      responsesRef.current.push({
        word: words[currentIndex]?.word || '',
        response: currentInputRef.current.trim()
      });
      setCurrentInput('');
      currentInputRef.current = '';
    }

    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (isInteractive) {
        submitInteractiveTest(responsesRef.current);
      } else {
        navigate('/completed');
      }
    }
  }, [currentIndex, words, isInteractive, submitInteractiveTest, navigate]);

  // Reset the ref when currentIndex changes
  useEffect(() => {
    completedRef.current = false;
  }, [currentIndex]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setCurrentInput(val);
    currentInputRef.current = val;
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleWordComplete();
    }
  };

  const handleEndEarly = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    
    responsesRef.current.push({
        word: words[currentIndex]?.word || '',
        response: currentInputRef.current.trim()
    });
    submitInteractiveTest(responsesRef.current);
  };

  const handleExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    navigate('/practice');
  };

  if (loading || isSubmitting) {
    return <LoadingScreen message={isSubmitting ? "Generating feedback..." : "Loading test content..."} />;
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
          {currentIndex +1} / {words.length}
        </div>
        {isInteractive && (
          <button className="btn btn-ghost" style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }} onClick={handleEndEarly}>
            End Early
          </button>
        )}
      </div>

      <div className="test-content" style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
        <div className="test-word">
          {words[currentIndex]?.word}
        </div>
        
        {isInteractive && (
          <input
            type="text"
            className="chat-input"
            style={{ width: '80%', maxWidth: '600px', textAlign: 'center', fontSize: '18px', padding: '16px' }}
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Type your sentence here..."
            autoFocus
            autoComplete="off"
          />
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

export default WATTest;
