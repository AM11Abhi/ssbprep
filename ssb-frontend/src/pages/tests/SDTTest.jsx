import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../../components/Timer.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import MockDataIndicator from '../../components/MockDataIndicator.jsx';
import useFullscreen from '../../hooks/useFullscreen.js';
import usePreventBack from '../../hooks/usePreventBack.js';
import { USE_MOCK_DATA, MOCK_SDT_DATA } from '../../data/mockTestData.js';

const TOTAL_SECONDS = 15 * 60;

const DEFAULT_HEADINGS = [
  'What your parents think about you',
  'What your teachers/employers think about you',
  'What your friends/colleagues think about you',
  'What you think about yourself',
  'What kind of person you want to be'
];

function SDTTest() {
  const navigate = useNavigate();
  const [headings, setHeadings] = useState(DEFAULT_HEADINGS);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useFullscreen();
  usePreventBack(() => setShowDialog(true));

  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await fetch('http://localhost:3000/content/sdt');
        if (response.ok) {
          const data = await response.json();
          setHeadings(data.headings || data || DEFAULT_HEADINGS);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        // TEMP MOCK DATA — REMOVE WHEN BACKEND IS RUNNING
        if (USE_MOCK_DATA) {
          setHeadings(MOCK_SDT_DATA.headings);
          setUsingMock(true);
        }
        // Falls back to DEFAULT_HEADINGS if mock is disabled
      }
      setLoading(false);
    };
    fetchHeadings();
  }, []);

  const handleComplete = () => {
    navigate('/completed');
  };

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

  return (
    <div className="test-container">
      <MockDataIndicator usingMock={usingMock} />
      <div className="test-header">
        <button className="btn btn-ghost" onClick={() => setShowDialog(true)}>
          ← Back
        </button>
        <Timer 
          seconds={TOTAL_SECONDS} 
          onComplete={handleComplete}
          paused={showDialog}
        />
        <div className="test-progress">
          All headings
        </div>
      </div>

      <div className="test-content">
        <div className="test-phase-label">
          Write descriptions on paper for each heading
        </div>
        
        <div className="sdt-headings">
          {headings.map((heading, index) => (
            <div key={index} className="sdt-heading-item">
              <div className="sdt-heading-number">Heading {index + 1}</div>
              <div className="sdt-heading-text">{heading}</div>
            </div>
          ))}
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

export default SDTTest;
