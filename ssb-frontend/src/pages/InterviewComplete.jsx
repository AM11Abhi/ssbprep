import { useLocation, useNavigate } from 'react-router-dom';
import { clearPIQ } from '../utils/piqStorage.js';

/**
 * Parses the raw feedback text (markdown with **Section** headers)
 * into an array of { title, body } objects.
 *
 * Handles both "1. **Title**" and "**Title**" formats.
 */
function parseFeedbackSections(raw) {
  if (!raw) return [];

  // Split on numbered headings like "1. **Topics Covered**" or "**Topics Covered**"
  const lines = raw.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    // Match "1. **Title**" or "**Title**" at the start of a line
    const headingMatch = line.match(/^(?:\d+\.\s*)?\*\*(.+?)\*\*/);
    if (headingMatch) {
      if (current) sections.push(current);
      current = { title: headingMatch[1].trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) sections.push(current);

  // Clean up body: strip leading/trailing blank lines, trim each line
  return sections.map((s) => ({
    title: s.title,
    body: s.body
      .join('\n')
      .replace(/^\s+|\s+$/g, '')
      // Remove leading dashes/bullets so we can style them ourselves
      .split('\n')
      .map((l) => l.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean),
  }));
}

const SECTION_ICONS = {
  'Topics Covered': '📋',
  'Areas to Reflect On': '🔍',
  'Preparation Suggestions': '📝',
};

function InterviewComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const feedback = location.state?.feedback ?? null;

  const sections = parseFeedbackSections(feedback);

  const handleRetake = () => {
    // Reuse existing PIQ — go straight to chat
    navigate('/interview/chat');
  };

  const handleStartNew = () => {
    clearPIQ();
    navigate('/interview/start');
  };

  // ── Fallback if navigated to directly with no state ──
  if (!feedback) {
    return (
      <div className="page-container">
        <div className="complete-fallback">
          <h2 className="heading-lg">no interview data found</h2>
          <p className="text-description">
            It looks like you navigated here directly. Please complete an interview first.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/interview/start')}>
            Go to Interview Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="complete-header">
        <div className="complete-badge">Interview Complete</div>
        <h1 className="heading-lg">preparation advice</h1>
        <p className="text-description">
          Based on your practice session. This is not an evaluation — use it to guide your preparation.
        </p>
      </div>

      {/* Sections */}
      {sections.length > 0 ? (
        <div className="complete-sections">
          {sections.map((section) => (
            <div key={section.title} className="complete-section-card">
              <div className="complete-section-title">
                <span>{SECTION_ICONS[section.title] ?? '•'}</span>
                {section.title}
              </div>
              <ul className="complete-section-list">
                {section.body.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        // Fallback: raw text if parsing finds no sections
        <div className="complete-section-card">
          <p className="complete-raw-text">{feedback}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="complete-actions">
        <button className="btn btn-ghost" onClick={handleRetake}>
          Retake Interview
        </button>
        <button className="btn btn-primary" onClick={handleStartNew}>
          Start New Interview
        </button>
      </div>
    </div>
  );
}

export default InterviewComplete;
