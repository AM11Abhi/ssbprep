const RELATION_OPTIONS = ['', 'Elder Brother', 'Younger Brother', 'Elder Sister', 'Younger Sister'];
const PARENTS_ALIVE_OPTIONS = ['', 'Both Alive', 'Father Deceased', 'Mother Deceased', 'Both Deceased'];

const EMPTY_SIBLING = { relation: '', occupation: '', income: '' };
const EMPTY_PARENT = { occupation: '', income: '' };

function ParentRow({ label, data = {}, onChange }) {
  return (
    <div className="piq-sub-section">
      <h3 className="piq-sub-title">{label}</h3>
      <div className="piq-fields-grid">
        <div className="piq-field">
          <label className="piq-label">Occupation</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. Retired Army Colonel"
            value={data.occupation || ''}
            onChange={(e) => onChange({ ...data, occupation: e.target.value })}
          />
        </div>
        <div className="piq-field">
          <label className="piq-label">Monthly Income (₹)</label>
          <input
            className="piq-input"
            type="text"
            placeholder="e.g. 80000"
            value={data.income || ''}
            onChange={(e) => onChange({ ...data, income: e.target.value })}
          />
        </div>
        {label.includes('Father') && (
          <div className="piq-field">
            <label className="piq-label">Age at Death (if applicable)</label>
            <input
              className="piq-input"
              type="number"
              placeholder="Leave blank if alive"
              value={data.ageAtDeath || ''}
              onChange={(e) => onChange({ ...data, ageAtDeath: e.target.value })}
            />
          </div>
        )}
        {label.includes('Mother') && (
          <div className="piq-field">
            <label className="piq-label">Age at Death (if applicable)</label>
            <input
              className="piq-input"
              type="number"
              placeholder="Leave blank if alive"
              value={data.ageAtDeath || ''}
              onChange={(e) => onChange({ ...data, ageAtDeath: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FamilySection({ piq, setPiq }) {
  const family = piq.family || {};
  const siblings = family.siblings || [];

  const setFamily = (updater) => {
    setPiq((prev) => ({
      ...prev,
      family: updater(prev.family || {}),
    }));
  };

  const handleParent = (key, value) => {
    setFamily((f) => ({ ...f, [key]: value }));
  };

  const handleField = (key, value) => {
    setFamily((f) => ({ ...f, [key]: value }));
  };

  // --- Sibling handlers ---
  const addSibling = () => {
    setFamily((f) => ({ ...f, siblings: [...(f.siblings || []), { ...EMPTY_SIBLING }] }));
  };

  const removeSibling = (index) => {
    setFamily((f) => ({
      ...f,
      siblings: f.siblings.filter((_, i) => i !== index),
    }));
  };

  const updateSibling = (index, field, value) => {
    setFamily((f) => ({
      ...f,
      siblings: f.siblings.map((s, i) => i === index ? { ...s, [field]: value } : s),
    }));
  };

  return (
    <div className="piq-section">
      <h2 className="piq-section-title">Family</h2>

      {/* Parents status */}
      <div className="piq-sub-section">
        <h3 className="piq-sub-title">Parents</h3>
        <div className="piq-fields-grid">
          <div className="piq-field">
            <label className="piq-label">Parents Status</label>
            <select
              className="piq-input piq-select"
              value={family.parentsAlive || ''}
              onChange={(e) => handleField('parentsAlive', e.target.value)}
            >
              {PARENTS_ALIVE_OPTIONS.map((o) => (
                <option key={o} value={o}>{o || 'Select...'}</option>
              ))}
            </select>
          </div>
          <div className="piq-field">
            <label className="piq-label">No. of Dependants</label>
            <input
              className="piq-input"
              type="number"
              placeholder="e.g. 4"
              value={family.dependants || ''}
              onChange={(e) => handleField('dependants', e.target.value)}
            />
          </div>
        </div>
      </div>

      <ParentRow
        label="Father"
        data={family.father || {}}
        onChange={(val) => handleParent('father', val)}
      />
      <ParentRow
        label="Mother"
        data={family.mother || {}}
        onChange={(val) => handleParent('mother', val)}
      />

      {/* Guardian */}
      <div className="piq-sub-section">
        <h3 className="piq-sub-title">Guardian (if applicable)</h3>
        <div className="piq-fields-grid">
          <div className="piq-field">
            <label className="piq-label">Occupation</label>
            <input
              className="piq-input"
              type="text"
              placeholder="Occupation"
              value={family.guardian?.occupation || ''}
              onChange={(e) => handleParent('guardian', { ...family.guardian, occupation: e.target.value })}
            />
          </div>
          <div className="piq-field">
            <label className="piq-label">Monthly Income (₹)</label>
            <input
              className="piq-input"
              type="text"
              placeholder="Income"
              value={family.guardian?.income || ''}
              onChange={(e) => handleParent('guardian', { ...family.guardian, income: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Siblings */}
      <div className="piq-sub-section">
        <div className="piq-dynamic-header">
          <h3 className="piq-sub-title">Siblings</h3>
          <button className="btn btn-ghost piq-add-btn" onClick={addSibling}>
            + Add Sibling
          </button>
        </div>

        {siblings.length === 0 && (
          <p className="piq-empty-hint">No siblings added yet.</p>
        )}

        {siblings.map((sibling, index) => (
          <div key={index} className="piq-dynamic-item">
            <div className="piq-dynamic-item-header">
              <span className="piq-dynamic-item-label">Sibling {index + 1}</span>
              <button
                className="piq-remove-btn"
                onClick={() => removeSibling(index)}
              >
                Remove
              </button>
            </div>
            <div className="piq-fields-grid">
              <div className="piq-field">
                <label className="piq-label">Relation</label>
                <select
                  className="piq-input piq-select"
                  value={sibling.relation || ''}
                  onChange={(e) => updateSibling(index, 'relation', e.target.value)}
                >
                  {RELATION_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r || 'Select...'}</option>
                  ))}
                </select>
              </div>
              <div className="piq-field">
                <label className="piq-label">Occupation</label>
                <input
                  className="piq-input"
                  type="text"
                  placeholder="e.g. Engineer"
                  value={sibling.occupation || ''}
                  onChange={(e) => updateSibling(index, 'occupation', e.target.value)}
                />
              </div>
              <div className="piq-field">
                <label className="piq-label">Monthly Income (₹)</label>
                <input
                  className="piq-input"
                  type="text"
                  placeholder="e.g. 60000"
                  value={sibling.income || ''}
                  onChange={(e) => updateSibling(index, 'income', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FamilySection;
