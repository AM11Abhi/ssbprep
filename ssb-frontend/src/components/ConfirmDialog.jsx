function ConfirmDialog({ isOpen, onContinue, onExit }) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2 className="dialog-title">Leave Test?</h2>
        <p className="dialog-message">
          You are leaving an ongoing test. Progress will be lost.
        </p>
        <div className="dialog-buttons">
          <button className="btn btn-secondary" onClick={onContinue}>
            Continue Test
          </button>
          <button className="btn btn-danger" onClick={onExit}>
            Exit Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
