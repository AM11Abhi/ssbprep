import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Completed() {
  const navigate = useNavigate();
  const [reflection, setReflection] = useState('');

  return (
    <div className="completion-container">
      <h1 className="completion-title">Test Completed</h1>
      <p className="completion-message">
        Your practice session has ended. Take a moment to reflect on your performance.
      </p>
      
      <textarea
        className="reflection-textarea"
        placeholder="Optional: Write your reflections here (not saved)..."
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
      />
      
      <button 
        className="btn btn-primary"
        onClick={() => navigate('/practice')}
      >
        Return to Practice
      </button>
    </div>
  );
}

export default Completed;
