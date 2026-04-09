const RELIGION_OPTIONS = [
  '', 'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Other',
];

const CATEGORY_OPTIONS = [
  '', 'General', 'OBC', 'SC', 'ST',
];

const MARITAL_STATUS_OPTIONS = [
  '', 'Single', 'Married', 'Divorced', 'Widowed',
];

/**
 * Calculates age in years and months from a date-of-birth string (YYYY-MM-DD).
 * Returns null if the date is invalid or in the future.
 */
function calcAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;

  const today = new Date();
  if (birth > today) return null;

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months };
}

/**
 * PersonalInfoSection
 *
 * Props:
 *   piq     - full PIQ state object
 *   setPiq  - state setter from parent (InterviewPIQ)
 */
function PersonalInfoSection({ piq, setPiq }) {
  const personal = piq.personal || {};

  /**
   * Generic field handler.
   * Updates piq.personal.<field> and keeps the rest of piq unchanged.
   */
  const handleChange = (field, value) => {
    setPiq((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  /** DOB change — also auto-calculates and stores age */
  const handleDobChange = (value) => {
    const age = calcAge(value);
    setPiq((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        dob: value,
        age: age,
      },
    }));
  };

  const age = personal.age;

  return (
    <div className="piq-section">
      <h2 className="piq-section-title">Personal Information</h2>

      <div className="piq-fields-grid">

        {/* Row 1 */}
        <div className="piq-field">
          <label className="piq-label">Selection Board</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. Allahabad"
            value={personal.board || ''}
            onChange={(e) => handleChange('board', e.target.value)}
          />
        </div>

        <div className="piq-field">
          <label className="piq-label">Batch No</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. 12"
            value={personal.batchNo || ''}
            onChange={(e) => handleChange('batchNo', e.target.value)}
          />
        </div>

        <div className="piq-field">
          <label className="piq-label">Chest No</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. 45"
            value={personal.chestNo || ''}
            onChange={(e) => handleChange('chestNo', e.target.value)}
          />
        </div>

        <div className="piq-field">
          <label className="piq-label">Roll No</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. 101"
            value={personal.rollNo || ''}
            onChange={(e) => handleChange('rollNo', e.target.value)}
          />
        </div>

        {/* Row 2 */}
        <div className="piq-field piq-field--wide">
          <label className="piq-label">Full Name</label>
          <input
            className="piq-input"
            type="text"
            placeholder="As on documents"
            value={personal.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div className="piq-field piq-field--wide">
          <label className="piq-label">Father's Name</label>
          <input
            className="piq-input"
            type="text"
            placeholder="Father's full name"
            value={personal.fatherName || ''}
            onChange={(e) => handleChange('fatherName', e.target.value)}
          />
        </div>

        {/* Row 3 — DOB + Age display */}
        <div className="piq-field">
          <label className="piq-label">Date of Birth</label>
          <input
            className="piq-input"
            type="date"
            value={personal.dob || ''}
            onChange={(e) => handleDobChange(e.target.value)}
          />
        </div>

        <div className="piq-field">
          <label className="piq-label">Age</label>
          <div className="piq-age-display">
            {age
              ? `${age.years} yrs ${age.months} mo`
              : <span className="piq-age-placeholder">Auto-calculated from DOB</span>}
          </div>
        </div>

        {/* Row 4 */}
        <div className="piq-field">
          <label className="piq-label">Religion</label>
          <select
            className="piq-input piq-select"
            value={personal.religion || ''}
            onChange={(e) => handleChange('religion', e.target.value)}
          >
            {RELIGION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt || 'Select...'}
              </option>
            ))}
          </select>
        </div>

        <div className="piq-field">
          <label className="piq-label">Category</label>
          <select
            className="piq-input piq-select"
            value={personal.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt || 'Select...'}
              </option>
            ))}
          </select>
        </div>

        <div className="piq-field">
          <label className="piq-label">Mother Tongue</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. Hindi"
            value={personal.motherTongue || ''}
            onChange={(e) => handleChange('motherTongue', e.target.value)}
          />
        </div>

        <div className="piq-field">
          <label className="piq-label">Marital Status</label>
          <select
            className="piq-input piq-select"
            value={personal.maritalStatus || ''}
            onChange={(e) => handleChange('maritalStatus', e.target.value)}
          >
            {MARITAL_STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt || 'Select...'}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}

export default PersonalInfoSection;
