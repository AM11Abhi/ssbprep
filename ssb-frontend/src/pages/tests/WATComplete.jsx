import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Parses the raw feedback text (markdown with ## Section headers)
 * into an array of { title, body } objects.
 */
function parseWatFeedback(raw) {
  if (!raw) return [];

  const lines = raw.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)/);
    if (match) {
      if (current) sections.push(current);
      current = { title: match[1].trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) sections.push(current);

  return sections.map(s => ({
    title: s.title,
    // Keep it as an array of stripped lines 
    body: s.body
      .join('\n')
      .replace(/^\s+|\s+$/g, '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean),
  }));
}

const SECTION_ICONS = {
  'Overall Observations': '👀',
  'Strengths': '💪',
  'Areas to Refine': '🔧',
  'Preparation Tips': '💡',
};

function WATComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const advice = location.state?.advice ?? null;
  const responses = location.state?.responses ?? [];

  const sections = parseWatFeedback(advice);

  const handleRetake = () => {
    navigate('/practice/wat');
  };

  const handleReturnHome = () => {
    navigate('/practice');
  };

  if (!advice) {
    return (
      <div className="page-container">
        <div className="complete-fallback">
          <h2 className="heading-lg">no feedback found</h2>
          <p className="text-description">
            It looks like you navigated here directly or the test was not completed.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/practice')}>
            Return to Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="complete-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="complete-badge" style={{ 
          display: 'inline-block', backgroundColor: 'var(--accent-olive)', 
          padding: '4px 12px', borderRadius: 'var(--radius-pill)', 
          fontSize: '12px', fontWeight: 'bold', marginBottom: '16px' 
        }}>
          WAT Complete
        </div>
        <h1 className="heading-lg" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Test Feedback</h1>
        <p className="text-description" style={{ color: 'var(--text-secondary)' }}>
          Based on your {responses.length} responses. This evaluation covers structure, action-orientation, and positivity.
        </p>
      </div>

      {sections.length > 0 ? (
        <div className="complete-sections" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          {sections.map((section) => (
            <div key={section.title} className="complete-section-card" style={{
              backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px'
            }}>
              <div className="complete-section-title" style={{ 
                fontFamily: '"Baloo Bhai 2", sans-serif', fontSize: '18px', display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-primary)', marginBottom: '16px'
              }}>
                <span>{SECTION_ICONS[section.title] ?? '•'}</span>
                {section.title}
              </div>
              <div className="complete-section-body" style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.body.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="complete-section-card" style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', marginBottom: '40px' }}>
          <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{advice}</p>
        </div>
      )}

      <div className="complete-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={handleRetake}>
          Retake WAT
        </button>
        <button className="btn btn-primary" onClick={handleReturnHome}>
          Return to Practice
        </button>
      </div>
    </div>
  );
}

export default WATComplete;
