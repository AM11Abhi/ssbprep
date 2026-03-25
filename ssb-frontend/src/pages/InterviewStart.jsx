import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getPIQ, clearPIQ } from '../utils/piqStorage.js';

function InterviewStart() {
  const navigate = useNavigate();
  const savedPiq = getPIQ();

  // If no PIQ saved, redirect to the form immediately
  useEffect(() => {
    if (!savedPiq) {
      navigate('/interview/piq', { replace: true });
    }
  }, [savedPiq, navigate]);

  const handleContinue = () => {
    // Placeholder — will navigate to interview chat in Phase 5
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
            <button className="btn btn-primary interview-start-btn" onClick={handleContinue}>
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
    </>
  );
}

export default InterviewStart;
