import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';

function InstructionScreen({ title, instructions, duration, testRoute }) {
  const navigate = useNavigate();

  const handleStartTest = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        navigate(testRoute);
      });
    }
    navigate(testRoute);
  };

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
    </>
  );
}

export default InstructionScreen;
