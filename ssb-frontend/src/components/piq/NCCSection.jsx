function NCCSection({ piq, setPiq }) {
  const ncc = piq.ncc || {};

  const handleChange = (field, value) => {
    setPiq((prev) => ({
      ...prev,
      ncc: { ...prev.ncc, [field]: value },
    }));
  };

  return (
    <div className="piq-section">
      <h2 className="piq-section-title">NCC Training</h2>
      <div className="piq-fields-grid">
        <div className="piq-field piq-field--wide">
          <label className="piq-label">Did you attend NCC?</label>
          <div className="piq-toggle-group">
            <button
              className={`piq-toggle-btn ${ncc.trained === true ? 'active' : ''}`}
              onClick={() => handleChange('trained', true)}
              type="button"
            >
              Yes
            </button>
            <button
              className={`piq-toggle-btn ${ncc.trained === false ? 'active' : ''}`}
              onClick={() => handleChange('trained', false)}
              type="button"
            >
              No
            </button>
          </div>
        </div>

        {ncc.trained === true && (
          <div className="piq-field piq-field--wide">
            <label className="piq-label">NCC Details</label>
            <textarea
              className="piq-input piq-textarea"
              placeholder="e.g. NCC 'C' Certificate, Army Wing, 1 UP Battalion — 2 years, attended Annual Training Camp 2022"
              rows={3}
              value={ncc.details || ''}
              onChange={(e) => handleChange('details', e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default NCCSection;
