function PhysicalSection({ piq, setPiq }) {
  const physical = piq.physical || {};

  const handleChange = (field, value) => {
    setPiq((prev) => ({
      ...prev,
      physical: { ...prev.physical, [field]: value },
    }));
  };

  return (
    <div className="piq-section">
      <h2 className="piq-section-title">Physical Details</h2>
      <div className="piq-fields-grid">
        <div className="piq-field">
          <label className="piq-label">Height (cm)</label>
          <input
            className="piq-input"
            type="number"
            placeholder="e.g. 175"
            value={physical.height || ''}
            onChange={(e) => handleChange('height', e.target.value)}
          />
        </div>
        <div className="piq-field">
          <label className="piq-label">Weight (kg)</label>
          <input
            className="piq-input"
            type="number"
            placeholder="e.g. 68"
            value={physical.weight || ''}
            onChange={(e) => handleChange('weight', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default PhysicalSection;
