import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

function InstructionScreen({ title, instructions, duration, testRoute }) {
  const navigate = useNavigate();
  const [showStartConfirm, setShowStartConfirm] = useState(false);

  const startTest = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        navigate(testRoute);
      });
    }
    navigate(testRoute);
  };

  const handleStartTest = () => setShowStartConfirm(true);

  return (
    <>
      <Navbar />
      <div className="instruction-container">
        <Link to="/practice" className="back-link">← Back to Practice</Link>

        <h1 className="instruction-title">{title}</h1>

        <div className="instruction-duration">{duration}</div>

        <ul className="instruction-list">
          {instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>

        <button className="btn btn-primary" onClick={handleStartTest}>
          Start Test
        </button>
      </div>

      <ConfirmDialog
        isOpen={showStartConfirm}
        title="Start Test?"
        message="The test will begin and timers will start. Are you ready?"
        continueLabel="Start"
        exitLabel="Cancel"
        onContinue={() => {
          setShowStartConfirm(false);
          startTest();
        }}
        onExit={() => setShowStartConfirm(false)}
      />
    </>
  );
}

export default InstructionScreen;