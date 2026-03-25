const MEDIUM_OPTIONS = ['', 'English', 'Hindi', 'Regional Language'];
const BOARDER_OPTIONS = ['', 'Day Scholar', 'Boarder'];

const EDU_LEVELS = [
  { key: 'tenth', label: '10th Standard' },
  { key: 'twelfth', label: '12th Standard' },
  { key: 'graduation', label: 'Graduation' },
  { key: 'postGraduation', label: 'Post Graduation (if applicable)' },
];

function EduLevelBlock({ levelKey, label, data = {}, onChange }) {
  const handleField = (field, value) => {
    onChange(levelKey, { ...data, [field]: value });
  };

  return (
    <div className="piq-sub-section">
      <h3 className="piq-sub-title">{label}</h3>
      <div className="piq-fields-grid">

        <div className="piq-field piq-field--wide">
          <label className="piq-label">Qualification / Stream</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. Science (PCM)"
            value={data.qualification || ''}
            onChange={(e) => handleField('qualification', e.target.value)}
          />
        </div>

        <div className="piq-field piq-field--wide">
          <label className="piq-label">Institution Name</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. Kendriya Vidyalaya No. 1"
            value={data.institution || ''}
            onChange={(e) => handleField('institution', e.target.value)}
          />
        </div>

        <div className="piq-field">
          <label className="piq-label">Board / University</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. CBSE"
            value={data.board || ''}
            onChange={(e) => handleField('board', e.target.value)}
          />
        </div>

        <div className="piq-field">
          <label className="piq-label">Year of Passing</label>
          <input
            className="piq-input"
            type="number"
            placeholder="e.g. 2020"
            min="1990"
            max="2030"
            value={data.year || ''}
            onChange={(e) => handleField('year', e.target.value)}
          />
        </div>

        <div className="piq-field">
          <label className="piq-label">Marks %</label>
          <input
            className="piq-input"
            type="number"
            placeholder="e.g. 87.4"
            min="0"
            max="100"
            step="0.1"
            value={data.marks || ''}
            onChange={(e) => handleField('marks', e.target.value)}
          />
        </div>

        <div className="piq-field">
          <label className="piq-label">Medium</label>
          <select
            className="piq-input piq-select"
            value={data.medium || ''}
            onChange={(e) => handleField('medium', e.target.value)}
          >
            {MEDIUM_OPTIONS.map((m) => (
              <option key={m} value={m}>{m || 'Select...'}</option>
            ))}
          </select>
        </div>

        <div className="piq-field">
          <label className="piq-label">Boarder / Day Scholar</label>
          <select
            className="piq-input piq-select"
            value={data.boarderType || ''}
            onChange={(e) => handleField('boarderType', e.target.value)}
          >
            {BOARDER_OPTIONS.map((b) => (
              <option key={b} value={b}>{b || 'Select...'}</option>
            ))}
          </select>
        </div>

        <div className="piq-field">
          <label className="piq-label">State</label>
          <input
            className="piq-input"
            type="text"
            placeholder="State where studied"
            value={data.state || ''}
            onChange={(e) => handleField('state', e.target.value)}
          />
        </div>

        <div className="piq-field piq-field--wide">
          <label className="piq-label">Key Achievement (optional)</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. School topper, 95% aggregate"
            value={data.achievement || ''}
            onChange={(e) => handleField('achievement', e.target.value)}
          />
        </div>

      </div>
    </div>
  );
}

function EducationSection({ piq, setPiq }) {
  const education = piq.education || {};

  const handleLevelChange = (levelKey, updatedBlock) => {
    setPiq((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [levelKey]: updatedBlock,
      },
    }));
  };

  return (
    <div className="piq-section">
      <h2 className="piq-section-title">Education</h2>
      {EDU_LEVELS.map(({ key, label }) => (
        <EduLevelBlock
          key={key}
          levelKey={key}
          label={label}
          data={education[key] || {}}
          onChange={handleLevelChange}
        />
      ))}
    </div>
  );
}

export default EducationSection;
