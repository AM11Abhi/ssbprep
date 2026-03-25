function OccupationSection({ piq, setPiq }) {
  const occupation = piq.occupation || {};

  const handleChange = (field, value) => {
    setPiq((prev) => ({
      ...prev,
      occupation: { ...prev.occupation, [field]: value },
    }));
  };

  return (
    <div className="piq-section">
      <h2 className="piq-section-title">Present Occupation</h2>
      <div className="piq-fields-grid">
        <div className="piq-field piq-field--wide">
          <label className="piq-label">Occupation / Designation</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. Software Engineer at TCS, or Student"
            value={occupation.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
        <div className="piq-field">
          <label className="piq-label">Organisation</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. Tata Consultancy Services"
            value={occupation.organisation || ''}
            onChange={(e) => handleChange('organisation', e.target.value)}
          />
        </div>
        <div className="piq-field">
          <label className="piq-label">Monthly Income (₹)</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. 50000 or N/A if student"
            value={occupation.income || ''}
            onChange={(e) => handleChange('income', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default OccupationSection;
