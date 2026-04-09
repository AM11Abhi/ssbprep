import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import ModeSelectDialog from '../components/ModeSelectDialog.jsx';
import { getPIQ, clearPIQ } from '../utils/piqStorage.js';
import { setInterviewMode } from '../utils/interviewMode.js';

function InterviewStart() {
  const navigate = useNavigate();
  const savedPiq = getPIQ();
  const [showModeDialog, setShowModeDialog] = useState(false);

  // If no PIQ saved, redirect to the form immediately
  useEffect(() => {
    if (!savedPiq) {
      navigate('/interview/piq', { replace: true });
    }
  }, [savedPiq, navigate]);

  // "Start Interview" opens the mode selection dialog
  const handleStartClick = () => {
    setShowModeDialog(true);
  };

  // User selected a mode → save it and navigate to chat
  const handleModeSelect = (mode) => {
    setInterviewMode(mode);
    setShowModeDialog(false);
    navigate('/interview/chat');
  };

  const handleEditPiq = () => {
    navigate('/interview/piq');
  };

  const handleFillNew = () => {
    clearPIQ();
    navigate('/interview/piq');
  };

  // Don't render the card while redirecting
  if (!savedPiq) return null;

  const name = savedPiq?.personal?.name || 'Candidate';

  return (
    <>
      <Navbar />
      <div className="page-container centered">
        <div className="interview-start-card">
          <div className="interview-start-icon">🎖️</div>

          <h1 className="heading-md" style={{ marginBottom: '8px' }}>
            Start Interview
          </h1>

          <p className="text-description" style={{ marginBottom: '8px', textAlign: 'center' }}>
            Welcome, <strong style={{ color: 'var(--text-primary)' }}>{name}</strong>
          </p>
          <p className="text-description" style={{ marginBottom: '32px', textAlign: 'center' }}>
            You already have a saved Personal Information Questionnaire. The AI interviewer is ready.
          </p>

          <div className="interview-start-actions">
            <button
              className="btn btn-primary interview-start-btn"
              onClick={handleStartClick}
              id="start-interview-btn"
            >
              Start Interview
            </button>
            <button className="btn btn-ghost interview-start-btn" onClick={handleEditPiq}>
              Edit PIQ
            </button>
            <button className="btn btn-ghost interview-start-btn" onClick={handleFillNew}>
              Fill New PIQ
            </button>
          </div>
        </div>
      </div>

      {/* Mode selection dialog — opens on Start Interview click */}
      <ModeSelectDialog
        isOpen={showModeDialog}
        onSelect={handleModeSelect}
        onClose={() => setShowModeDialog(false)}
      />
    </>
  );
}

export default InterviewStart;
