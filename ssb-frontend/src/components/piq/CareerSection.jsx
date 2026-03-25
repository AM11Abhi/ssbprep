const COMMISSION_OPTIONS = [
  '', 'Permanent Commission', 'Short Service Commission', 'NCC Special Entry',
  'Technical Entry', 'TGC', 'UES', 'SSCo (W)', 'CDS',
];

const SERVICE_OPTIONS = [
  '', 'Army', 'Navy', 'Air Force',
  'Army (Infantry)', 'Army (Artillery)', 'Army (Engineers)',
  'Army (Signals)', 'Army (EME)', 'Army (ASC)',
  'Navy (Executive)', 'Navy (Education)',
  'Air Force (Flying)', 'Air Force (Technical)', 'Air Force (Ground Duty)',
];

function CareerSection({ piq, setPiq }) {
  const career = piq.career || {};

  const handleChange = (field, value) => {
    setPiq((prev) => ({
      ...prev,
      career: { ...prev.career, [field]: value },
    }));
  };

  return (
    <div className="piq-section">
      <h2 className="piq-section-title">Career Preference</h2>
      <div className="piq-fields-grid">
        <div className="piq-field">
          <label className="piq-label">Nature of Commission</label>
          <select
            className="piq-input piq-select"
            value={career.commission || ''}
            onChange={(e) => handleChange('commission', e.target.value)}
          >
            {COMMISSION_OPTIONS.map((o) => (
              <option key={o} value={o}>{o || 'Select...'}</option>
            ))}
          </select>
        </div>
        <div className="piq-field">
          <label className="piq-label">Choice of Service / Arm</label>
          <select
            className="piq-input piq-select"
            value={career.service || ''}
            onChange={(e) => handleChange('service', e.target.value)}
          >
            {SERVICE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o || 'Select...'}</option>
            ))}
          </select>
        </div>
        <div className="piq-field piq-field--wide">
          <label className="piq-label">Why do you want to join the Armed Forces?</label>
          <textarea
            className="piq-input piq-textarea"
            placeholder="Briefly state your motivation (this will help the AI ask relevant questions)"
            rows={3}
            value={career.motivation || ''}
            onChange={(e) => handleChange('motivation', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default CareerSection;
