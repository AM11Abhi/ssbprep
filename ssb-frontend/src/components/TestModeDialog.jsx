function TestModeDialog({ isOpen, onSelect, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content mode-dialog" onClick={(e) => e.stopPropagation()}>

        <h2 className="dialog-title">Select Test Mode</h2>
        <p className="dialog-message">
          How would you like to take this test?
        </p>

        <div className="mode-options">

          {/* Practice Mode */}
          <button
            className="mode-card"
            onClick={() => onSelect('practice')}
          >
            <span className="mode-card-icon">📝</span>
            <span className="mode-card-title">Practice Mode</span>
            <span className="mode-card-desc">
              Traditional pen & paper. Words auto-advance every 15 seconds.
            </span>
          </button>

          {/* Interactive Mode */}
          <button
            className="mode-card"
            onClick={() => onSelect('interactive')}
          >
            <span className="mode-card-icon">⌨️</span>
            <span className="mode-card-title">Interactive Mode</span>
            <span className="mode-card-desc">
              Type your responses directly. Get AI feedback on your structure.
            </span>
          </button>

        </div>

      </div>
    </div>
  );
}

export default TestModeDialog;
