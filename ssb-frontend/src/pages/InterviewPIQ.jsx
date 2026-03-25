import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getPIQ, savePIQ, clearPIQ } from '../utils/piqStorage.js';
import PersonalInfoSection from '../components/piq/PersonalInfoSection.jsx';
import AddressSection from '../components/piq/AddressSection.jsx';
import FamilySection from '../components/piq/FamilySection.jsx';
import EducationSection from '../components/piq/EducationSection.jsx';
import ActivitiesSection from '../components/piq/ActivitiesSection.jsx';
import PhysicalSection from '../components/piq/PhysicalSection.jsx';
import OccupationSection from '../components/piq/OccupationSection.jsx';
import NCCSection from '../components/piq/NCCSection.jsx';
import CareerSection from '../components/piq/CareerSection.jsx';
import AttemptsSection from '../components/piq/AttemptsSection.jsx';
import SSBHistorySection from '../components/piq/SSBHistorySection.jsx';
import ReviewSection from '../components/piq/ReviewSection.jsx';

const initialPiq = {
  personal: {},
  address: {},
  family: {},
  education: {},
  activities: {},
  physical: {},
  occupation: {},
  ncc: {},
  career: {},
  attempts: {},
  ssbHistory: [],
};

function InterviewPIQ() {
  const navigate = useNavigate();
  const [piq, setPiq] = useState(initialPiq);
  const [saved, setSaved] = useState(false);

  // Load PIQ from localStorage on mount
  useEffect(() => {
    const savedPiq = getPIQ();
    if (savedPiq) {
      // Merge with initialPiq to ensure all new keys exist
      setPiq({ ...initialPiq, ...savedPiq });
    }
  }, []);

  const handleSaveDraft = () => {
    savePIQ(piq);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleStartInterview = () => {
    savePIQ(piq);
    navigate('/interview/start');
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <Link to="/practice" className="back-link">← Back to Practice</Link>

        <h1 className="heading-lg">personal information questionnaire</h1>

        <p className="text-description" style={{ marginBottom: '40px' }}>
          Fill in your details below. This information will be used by the AI interviewer
          to conduct a realistic SSB interview. Your data is stored locally and never sent to any server.
        </p>

        <PersonalInfoSection piq={piq} setPiq={setPiq} />
        <AddressSection piq={piq} setPiq={setPiq} />
        <FamilySection piq={piq} setPiq={setPiq} />
        <EducationSection piq={piq} setPiq={setPiq} />
        <ActivitiesSection piq={piq} setPiq={setPiq} />
        <PhysicalSection piq={piq} setPiq={setPiq} />
        <OccupationSection piq={piq} setPiq={setPiq} />
        <NCCSection piq={piq} setPiq={setPiq} />
        <CareerSection piq={piq} setPiq={setPiq} />
        <AttemptsSection piq={piq} setPiq={setPiq} />
        <SSBHistorySection piq={piq} setPiq={setPiq} />

        <ReviewSection piq={piq} />

        {/* Action buttons */}
        <div className="piq-actions">
          <button className="btn btn-ghost" onClick={handleSaveDraft}>
            Save Draft
          </button>
          <button className="btn btn-primary piq-submit-btn" onClick={handleStartInterview}>
            Start Interview →
          </button>
        </div>

        {saved && (
          <div className="piq-saved-toast">
            Draft saved ✓
          </div>
        )}
      </div>
    </>
  );
}

export default InterviewPIQ;
