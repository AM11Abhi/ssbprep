import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../../components/Timer.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import MockDataIndicator from '../../components/MockDataIndicator.jsx';
import useFullscreen from '../../hooks/useFullscreen.js';
import usePreventBack from '../../hooks/usePreventBack.js';
import { USE_MOCK_DATA, MOCK_SRT_DATA } from '../../data/mockTestData.js';

const TOTAL_SECONDS = 30 * 60;
const ITEMS_PER_PAGE = 10;

function SRTTest() {
  const navigate = useNavigate();
  const [situations, setSituations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  useFullscreen();
  usePreventBack(() => setShowDialog(true));

  useEffect(() => {
    const fetchSituations = async () => {
      try {
        const response = await fetch('http://localhost:3000/content/srt');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        console.log("SRT res:", data.items);
        setSituations(data.items.map(item => item.situation) || data);
        setLoading(false);
      } catch (err) {
        // TEMP MOCK DATA — REMOVE WHEN BACKEND IS RUNNING
        if (USE_MOCK_DATA) {
          const mockSituations = MOCK_SRT_DATA.items.map(item => item.situation);
          setSituations(mockSituations);
          setUsingMock(true);
          setLoading(false);
        } else {
          setError('Could not load test content. Please try again.');
          setLoading(false);
        }
      }
    };
    fetchSituations();
  }, []);

  const totalPages = Math.ceil(situations.length / ITEMS_PER_PAGE);
  
  const getCurrentPageSituations = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return situations.slice(startIndex, endIndex).map((situation, index) => ({
      number: startIndex + index + 1,
      text: situation
    }));
  };

  const handleComplete = () => {
    navigate('/completed');
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
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
          seconds={TOTAL_SECONDS} 
          onComplete={handleComplete}
          paused={showDialog}
        />
        <div className="test-progress">
          {situations.length} situations
        </div>
      </div>

      <div className="srt-booklet-container">
        <div className="srt-instruction">
          Write your responses on paper. Attempt situations in any order.
        </div>

        <div className="srt-situations-list">
          {getCurrentPageSituations().map((item) => (
            <div key={item.number} className="srt-situation-item">
              <span className="srt-situation-number">{item.number}.</span>
              <span className="srt-situation-text">{item.text}</span>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="srt-pagination">
            <button 
              className="btn btn-ghost srt-pagination-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              ← Previous
            </button>
            <span className="srt-pagination-info">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button 
              className="btn btn-ghost srt-pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              Next →
            </button>
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

export default SRTTest;
