const SPORT_LEVEL_OPTIONS = ['', 'School', 'District', 'State', 'National', 'International'];
const EMPTY_SPORT = { name: '', level: '', duration: '', achievement: '' };
const EMPTY_ACTIVITY = { activity: '', role: '', duration: '', achievement: '' };
const EMPTY_POSITION = { role: '', organization: '', duration: '' };

function ActivitiesSection({ piq, setPiq }) {
  const activities = piq.activities || {};
  const sports = activities.sports || [];
  const hobbies = activities.hobbies || ['', '', ''];
  const extraCurricular = activities.extraCurricular || [];
  const positions = activities.positions || [];

  /** Generic helper — updates one key inside piq.activities */
  const setActivities = (updater) => {
    setPiq((prev) => ({
      ...prev,
      activities: updater(prev.activities || {}),
    }));
  };

  // --- Sports ---
  const addSport = () => {
    setActivities((a) => ({ ...a, sports: [...(a.sports || []), { ...EMPTY_SPORT }] }));
  };
  const removeSport = (i) => {
    setActivities((a) => ({ ...a, sports: a.sports.filter((_, idx) => idx !== i) }));
  };
  const updateSport = (i, field, value) => {
    setActivities((a) => ({
      ...a,
      sports: a.sports.map((s, idx) => idx === i ? { ...s, [field]: value } : s),
    }));
  };

  // --- Hobbies (fixed 3 slots) ---
  const updateHobby = (i, value) => {
    setActivities((a) => {
      const h = [...(a.hobbies || ['', '', ''])];
      h[i] = value;
      return { ...a, hobbies: h };
    });
  };

  // --- Extra Curricular ---
  const addActivity = () => {
    setActivities((a) => ({ ...a, extraCurricular: [...(a.extraCurricular || []), { ...EMPTY_ACTIVITY }] }));
  };
  const removeActivity = (i) => {
    setActivities((a) => ({ ...a, extraCurricular: a.extraCurricular.filter((_, idx) => idx !== i) }));
  };
  const updateActivity = (i, field, value) => {
    setActivities((a) => ({
      ...a,
      extraCurricular: a.extraCurricular.map((act, idx) => idx === i ? { ...act, [field]: value } : act),
    }));
  };

  // --- Positions of Responsibility ---
  const addPosition = () => {
    setActivities((a) => ({ ...a, positions: [...(a.positions || []), { ...EMPTY_POSITION }] }));
  };
  const removePosition = (i) => {
    setActivities((a) => ({ ...a, positions: a.positions.filter((_, idx) => idx !== i) }));
  };
  const updatePosition = (i, field, value) => {
    setActivities((a) => ({
      ...a,
      positions: a.positions.map((p, idx) => idx === i ? { ...p, [field]: value } : p),
    }));
  };

  return (
    <div className="piq-section">
      <h2 className="piq-section-title">Activities & Interests</h2>

      {/* ── Sports ── */}
      <div className="piq-sub-section">
        <div className="piq-dynamic-header">
          <h3 className="piq-sub-title">Sports</h3>
          <button className="btn btn-ghost piq-add-btn" onClick={addSport}>+ Add Sport</button>
        </div>
        {sports.length === 0 && <p className="piq-empty-hint">No sports added yet.</p>}
        {sports.map((sport, i) => (
          <div key={i} className="piq-dynamic-item">
            <div className="piq-dynamic-item-header">
              <span className="piq-dynamic-item-label">Sport {i + 1}</span>
              <button className="piq-remove-btn" onClick={() => removeSport(i)}>Remove</button>
            </div>
            <div className="piq-fields-grid">
              <div className="piq-field">
                <label className="piq-label">Sport / Game</label>
                <input className="piq-input" type="text" placeholder="e.g. Cricket"
                  value={sport.name || ''} onChange={(e) => updateSport(i, 'name', e.target.value)} />
              </div>
              <div className="piq-field">
                <label className="piq-label">Highest Level</label>
                <select className="piq-input piq-select"
                  value={sport.level || ''} onChange={(e) => updateSport(i, 'level', e.target.value)}>
                  {SPORT_LEVEL_OPTIONS.map((l) => (
                    <option key={l} value={l}>{l || 'Select...'}</option>
                  ))}
                </select>
              </div>
              <div className="piq-field">
                <label className="piq-label">Duration (years)</label>
                <input className="piq-input" type="text" placeholder="e.g. 5 years"
                  value={sport.duration || ''} onChange={(e) => updateSport(i, 'duration', e.target.value)} />
              </div>
              <div className="piq-field">
                <label className="piq-label">Achievement</label>
                <input className="piq-input" type="text" placeholder="e.g. District champion 2021"
                  value={sport.achievement || ''} onChange={(e) => updateSport(i, 'achievement', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Hobbies (3 fixed slots) ── */}
      <div className="piq-sub-section">
        <h3 className="piq-sub-title">Hobbies</h3>
        <div className="piq-fields-grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className="piq-field">
              <label className="piq-label">Hobby {i + 1}</label>
              <input className="piq-input" type="text" placeholder="e.g. Reading"
                value={hobbies[i] || ''} onChange={(e) => updateHobby(i, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Extra Curricular ── */}
      <div className="piq-sub-section">
        <div className="piq-dynamic-header">
          <h3 className="piq-sub-title">Extra Curricular Activities</h3>
          <button className="btn btn-ghost piq-add-btn" onClick={addActivity}>+ Add Activity</button>
        </div>
        {extraCurricular.length === 0 && <p className="piq-empty-hint">No activities added yet.</p>}
        {extraCurricular.map((act, i) => (
          <div key={i} className="piq-dynamic-item">
            <div className="piq-dynamic-item-header">
              <span className="piq-dynamic-item-label">Activity {i + 1}</span>
              <button className="piq-remove-btn" onClick={() => removeActivity(i)}>Remove</button>
            </div>
            <div className="piq-fields-grid">
              <div className="piq-field piq-field--wide">
                <label className="piq-label">Activity Name</label>
                <input className="piq-input" type="text" placeholder="e.g. NSS, NCC, Debate"
                  value={act.activity || ''} onChange={(e) => updateActivity(i, 'activity', e.target.value)} />
              </div>
              <div className="piq-field">
                <label className="piq-label">Role</label>
                <input className="piq-input" type="text" placeholder="e.g. Secretary"
                  value={act.role || ''} onChange={(e) => updateActivity(i, 'role', e.target.value)} />
              </div>
              <div className="piq-field">
                <label className="piq-label">Duration</label>
                <input className="piq-input" type="text" placeholder="e.g. 2 years"
                  value={act.duration || ''} onChange={(e) => updateActivity(i, 'duration', e.target.value)} />
              </div>
              <div className="piq-field piq-field--wide">
                <label className="piq-label">Achievement</label>
                <input className="piq-input" type="text" placeholder="e.g. Best volunteer award"
                  value={act.achievement || ''} onChange={(e) => updateActivity(i, 'achievement', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Positions of Responsibility ── */}
      <div className="piq-sub-section">
        <div className="piq-dynamic-header">
          <h3 className="piq-sub-title">Positions of Responsibility</h3>
          <button className="btn btn-ghost piq-add-btn" onClick={addPosition}>+ Add Position</button>
        </div>
        {positions.length === 0 && <p className="piq-empty-hint">No positions added yet.</p>}
        {positions.map((pos, i) => (
          <div key={i} className="piq-dynamic-item">
            <div className="piq-dynamic-item-header">
              <span className="piq-dynamic-item-label">Position {i + 1}</span>
              <button className="piq-remove-btn" onClick={() => removePosition(i)}>Remove</button>
            </div>
            <div className="piq-fields-grid">
              <div className="piq-field">
                <label className="piq-label">Role / Title</label>
                <input className="piq-input" type="text" placeholder="e.g. School Captain"
                  value={pos.role || ''} onChange={(e) => updatePosition(i, 'role', e.target.value)} />
              </div>
              <div className="piq-field">
                <label className="piq-label">Organization</label>
                <input className="piq-input" type="text" placeholder="e.g. KV No. 1 Delhi"
                  value={pos.organization || ''} onChange={(e) => updatePosition(i, 'organization', e.target.value)} />
              </div>
              <div className="piq-field">
                <label className="piq-label">Duration</label>
                <input className="piq-input" type="text" placeholder="e.g. 2022-2023"
                  value={pos.duration || ''} onChange={(e) => updatePosition(i, 'duration', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ActivitiesSection;
