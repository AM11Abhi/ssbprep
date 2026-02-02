function ConfirmDialog({
  isOpen,
  onContinue,
  onExit,
  title = 'Leave Test?',
  message = 'You are leaving an ongoing test. Progress will be lost.',
  continueLabel = 'Continue Test',
  exitLabel = 'Exit Test'
}) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2 className="dialog-title">{title}</h2>
        <p className="dialog-message">{message}</p>
        <div className="dialog-buttons">
          <button className="btn btn-secondary" onClick={onContinue}>
            {continueLabel}
          </button>
          <button className="btn btn-danger" onClick={onExit}>
            {exitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;