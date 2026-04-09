/**
 * ReviewSection
 *
 * Displays a read-only summary of the key PIQ data the AI will use.
 * Helps the user verify before starting the interview.
 */
function ReviewSection({ piq }) {
  const p = piq.personal || {};
  const edu = piq.education || {};
  const act = piq.activities || {};
  const career = piq.career || {};
  const ncc = piq.ncc || {};
  const physical = piq.physical || {};
  const occupation = piq.occupation || {};
  const attempts = piq.attempts || {};

  const hobbies = (act.hobbies || []).filter(Boolean);
  const sports = (act.sports || []).filter((s) => s.name);
  const extraCurricular = (act.extraCurricular || []).filter((a) => a.activity);
  const positions = (act.positions || []).filter((pos) => pos.role);

  const renderList = (items, getLabel) => {
    if (!items || items.length === 0) return <span className="review-empty">—</span>;
    return (
      <ul className="review-list">
        {items.map((item, i) => <li key={i}>{getLabel(item)}</li>)}
      </ul>
    );
  };

  const renderValue = (val) =>
    val ? <span className="review-value">{val}</span> : <span className="review-empty">—</span>;

  return (
    <div className="piq-section review-section">
      <h2 className="piq-section-title">Review Your PIQ</h2>
      <p className="text-description" style={{ marginBottom: '24px' }}>
        The AI interviewer will use this information. Verify your key details before starting.
      </p>

      <div className="review-grid">

        {/* Identity */}
        <div className="review-card">
          <div className="review-card-title">Identity</div>
          <div className="review-row"><span>Name</span>{renderValue(p.name)}</div>
          <div className="review-row"><span>Age</span>{renderValue(p.age ? `${p.age.years} yrs ${p.age.months} mo` : null)}</div>
          <div className="review-row"><span>Category</span>{renderValue(p.category)}</div>
          <div className="review-row"><span>Religion</span>{renderValue(p.religion)}</div>
          <div className="review-row"><span>Marital Status</span>{renderValue(p.maritalStatus)}</div>
        </div>

        {/* Career */}
        <div className="review-card">
          <div className="review-card-title">Career Preference</div>
          <div className="review-row"><span>Commission</span>{renderValue(career.commission)}</div>
          <div className="review-row"><span>Service</span>{renderValue(career.service)}</div>
          <div className="review-row"><span>NCC</span>{renderValue(ncc.trained === true ? 'Yes' : ncc.trained === false ? 'No' : null)}</div>
          <div className="review-row"><span>Occupation</span>{renderValue(occupation.title)}</div>
          <div className="review-row"><span>SSB Attempts</span>{renderValue(attempts.count !== undefined && attempts.count !== '' ? `${attempts.count}` : null)}</div>
        </div>

        {/* Education */}
        <div className="review-card">
          <div className="review-card-title">Education</div>
          {['tenth', 'twelfth', 'graduation', 'postGraduation'].map((key) => {
            const e = edu[key] || {};
            const label = { tenth: '10th', twelfth: '12th', graduation: 'Graduation', postGraduation: 'Post Grad' }[key];
            if (!e.institution && !e.marks) return null;
            return (
              <div key={key} className="review-row">
                <span>{label}</span>
                <span className="review-value">
                  {[e.institution, e.marks ? `${e.marks}%` : ''].filter(Boolean).join(' — ')}
                </span>
              </div>
            );
          })}
          {!edu.tenth?.institution && !edu.twelfth?.institution && !edu.graduation?.institution && (
            <span className="review-empty">No education filled yet</span>
          )}
        </div>

        {/* Physical */}
        <div className="review-card">
          <div className="review-card-title">Physical</div>
          <div className="review-row"><span>Height</span>{renderValue(physical.height ? `${physical.height} cm` : null)}</div>
          <div className="review-row"><span>Weight</span>{renderValue(physical.weight ? `${physical.weight} kg` : null)}</div>
        </div>

        {/* Sports */}
        <div className="review-card">
          <div className="review-card-title">Sports</div>
          {renderList(sports, (s) => `${s.name}${s.level ? ` (${s.level})` : ''}`)}
        </div>

        {/* Hobbies & Activities */}
        <div className="review-card">
          <div className="review-card-title">Hobbies</div>
          {hobbies.length > 0
            ? <ul className="review-list">{hobbies.map((h, i) => <li key={i}>{h}</li>)}</ul>
            : <span className="review-empty">—</span>
          }
        </div>

        {/* Extra Curricular */}
        <div className="review-card">
          <div className="review-card-title">Extra Curricular</div>
          {renderList(extraCurricular, (a) => a.activity)}
        </div>

        {/* Positions */}
        <div className="review-card">
          <div className="review-card-title">Positions of Responsibility</div>
          {renderList(positions, (pos) => `${pos.role}${pos.organization ? ` @ ${pos.organization}` : ''}`)}
        </div>

      </div>
    </div>
  );
}

export default ReviewSection;
