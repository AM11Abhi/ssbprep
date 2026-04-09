const EMPTY_ENTRY = { board: '', date: '', entryType: '', chestNo: '', batchNo: '' };

function SSBHistorySection({ piq, setPiq }) {
  const history = piq.ssbHistory || [];

  const setHistory = (updater) => {
    setPiq((prev) => ({
      ...prev,
      ssbHistory: updater(prev.ssbHistory || []),
    }));
  };

  const addEntry = () => {
    setHistory((h) => [...h, { ...EMPTY_ENTRY }]);
  };

  const removeEntry = (i) => {
    setHistory((h) => h.filter((_, idx) => idx !== i));
  };

  const updateEntry = (i, field, value) => {
    setHistory((h) => h.map((entry, idx) => idx === i ? { ...entry, [field]: value } : entry));
  };

  return (
    <div className="piq-section">
      <h2 className="piq-section-title">Previous SSB History</h2>
      <p className="piq-section-placeholder" style={{ marginBottom: '16px' }}>
        Add details of each previous SSB attempt, if any.
      </p>

      <div className="piq-dynamic-header">
        <h3 className="piq-sub-title">Attempt Log</h3>
        <button className="btn btn-ghost piq-add-btn" onClick={addEntry}>+ Add Entry</button>
      </div>

      {history.length === 0 && (
        <p className="piq-empty-hint">No previous SSB history added.</p>
      )}

      {history.map((entry, i) => (
        <div key={i} className="piq-dynamic-item">
          <div className="piq-dynamic-item-header">
            <span className="piq-dynamic-item-label">Attempt {i + 1}</span>
            <button className="piq-remove-btn" onClick={() => removeEntry(i)}>Remove</button>
          </div>
          <div className="piq-fields-grid">
            <div className="piq-field">
              <label className="piq-label">Selection Board</label>
              <input
                className="piq-input"
                type="text"
                placeholder="e.g. Allahabad"
                value={entry.board || ''}
                onChange={(e) => updateEntry(i, 'board', e.target.value)}
              />
            </div>
            <div className="piq-field">
              <label className="piq-label">Date (approx.)</label>
              <input
                className="piq-input"
                type="month"
                value={entry.date || ''}
                onChange={(e) => updateEntry(i, 'date', e.target.value)}
              />
            </div>
            <div className="piq-field">
              <label className="piq-label">Entry Type</label>
              <input
                className="piq-input"
                type="text"
                placeholder="e.g. CDS, NCC, TES"
                value={entry.entryType || ''}
                onChange={(e) => updateEntry(i, 'entryType', e.target.value)}
              />
            </div>
            <div className="piq-field">
              <label className="piq-label">Chest No</label>
              <input
                className="piq-input"
                type="text"
                placeholder="e.g. 45"
                value={entry.chestNo || ''}
                onChange={(e) => updateEntry(i, 'chestNo', e.target.value)}
              />
            </div>
            <div className="piq-field">
              <label className="piq-label">Batch No</label>
              <input
                className="piq-input"
                type="text"
                placeholder="e.g. 12"
                value={entry.batchNo || ''}
                onChange={(e) => updateEntry(i, 'batchNo', e.target.value)}
              />
            </div>
            <div className="piq-field">
              <label className="piq-label">Result</label>
              <input
                className="piq-input"
                type="text"
                placeholder="e.g. Screened Out / Conferenced Out / Not Recommended"
                value={entry.result || ''}
                onChange={(e) => updateEntry(i, 'result', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SSBHistorySection;
