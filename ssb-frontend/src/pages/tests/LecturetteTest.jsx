import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../../components/Timer.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import MockDataIndicator from '../../components/MockDataIndicator.jsx';
import useFullscreen from '../../hooks/useFullscreen.js';
import usePreventBack from '../../hooks/usePreventBack.js';
import { api } from '../../utils/api.js';
import { USE_MOCK_DATA, MOCK_LECTURETTE_DATA } from '../../data/mockTestData.js';

const PREP_SECONDS = 3 * 60;
const SPEAK_SECONDS = 3 * 60;

const DEFAULT_TOPICS = [
  'Leadership in Modern Times',
  'Importance of Discipline in Life',
  'Role of Youth in Nation Building',
  'Challenges Facing Indian Defense Forces'
];

function LecturetteTest() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState(DEFAULT_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [phase, setPhase] = useState('select');
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [usingMock, setUsingMock] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useFullscreen();
  usePreventBack(() => setShowDialog(true));

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(api.lecturette());
        if (response.ok) {
          const data = await response.json();
          setTopics(data.topics.map(item => item.topic) || data || DEFAULT_TOPICS);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        // TEMP MOCK DATA — REMOVE WHEN BACKEND IS RUNNING
        if (USE_MOCK_DATA) {
          const mockTopics = MOCK_LECTURETTE_DATA.items.map(item => item.topic);
          setTopics(mockTopics);
          setUsingMock(true);
        }
        // Falls back to DEFAULT_TOPICS if mock is disabled
      }
      setLoading(false);
    };
    fetchTopics();
  }, []);

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
  };

  const handleStartPrep = () => {
    if (selectedTopic) {
      setPhase('prep');
    }
  };

  const handlePrepComplete = () => {
    setPhase('speak');
  };

  const handleSpeakComplete = () => {
    stopRecording();
    navigate('/completed');
  };

  const handleExit = () => {
    stopRecording();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    navigate('/practice');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.log('Recording not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
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
        {phase !== 'select' && (
          <Timer 
            key={phase}
            seconds={phase === 'prep' ? PREP_SECONDS : SPEAK_SECONDS} 
            onComplete={phase === 'prep' ? handlePrepComplete : handleSpeakComplete}
            paused={showDialog}
          />
        )}
        <div className="test-progress">
          {phase === 'select' ? 'Select topic' : phase === 'prep' ? 'Preparation' : 'Speaking'}
        </div>
      </div>

      <div className="test-content">
        {phase === 'select' && (
          <>
            <div className="test-phase-label">Choose one topic</div>
            <div className="lecturette-topics">
              {topics.map((topic, index) => (
                <div 
                  key={index}
                  className={`lecturette-topic ${selectedTopic === topic ? 'selected' : ''}`}
                  onClick={() => handleSelectTopic(topic)}
                >
                  <div className="lecturette-topic-number">Topic {index + 1}</div>
                  <div>{topic}</div>
                </div>
              ))}
            </div>
            {selectedTopic && (
              <div style={{ marginTop: '32px' }}>
                <button className="btn btn-primary" onClick={handleStartPrep}>
                  Start Preparation
                </button>
              </div>
            )}
          </>
        )}

        {phase === 'prep' && (
          <>
            <div className="test-phase-label">Preparation Time</div>
            <div className="test-word" style={{ fontSize: '1.5rem' }}>
              {selectedTopic}
            </div>
            <p style={{ marginTop: '24px', color: 'var(--text-secondary)' }}>
              Prepare your thoughts for the lecture
            </p>
          </>
        )}

        {phase === 'speak' && (
          <>
            <div className="test-phase-label">Speaking Time</div>
            <div className="test-word" style={{ fontSize: '1.5rem' }}>
              {selectedTopic}
            </div>
            {/* <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
              {!isRecording ? (
                <button className="btn btn-secondary" onClick={startRecording}>
                  Start Recording (Optional)
                </button>
              ) : (
                <button className="btn btn-danger" onClick={stopRecording}>
                  Stop Recording
                </button>
              )}
            </div> */}
            {isRecording && (
              <p style={{ marginTop: '16px', color: 'var(--danger)', fontSize: '14px' }}>
                ● Recording... (local only, not saved)
              </p>
            )}
          </>
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

export default LecturetteTest;
