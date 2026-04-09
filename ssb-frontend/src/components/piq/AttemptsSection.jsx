function AttemptsSection({ piq, setPiq }) {
  const attempts = piq.attempts || {};

  const handleChange = (field, value) => {
    setPiq((prev) => ({
      ...prev,
      attempts: { ...prev.attempts, [field]: value },
    }));
  };

  return (
    <div className="piq-section">
      <h2 className="piq-section-title">SSB Attempts</h2>
      <div className="piq-fields-grid">
        <div className="piq-field">
          <label className="piq-label">Number of Previous SSB Attempts</label>
          <input
            className="piq-input"
            type="number"
            placeholder="e.g. 2 (or 0 if first time)"
            min="0"
            max="20"
            value={attempts.count || ''}
            onChange={(e) => handleChange('count', e.target.value)}
          />
        </div>
        <div className="piq-field">
          <label className="piq-label">Total Recommendations (if any)</label>
          <input
            className="piq-input"
            type="number"
            placeholder="e.g. 0"
            min="0"
            value={attempts.recommendations || ''}
            onChange={(e) => handleChange('recommendations', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default AttemptsSection;
