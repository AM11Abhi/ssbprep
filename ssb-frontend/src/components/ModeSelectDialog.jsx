/**
 * ModeSelectDialog
 *
 * A modal dialog that lets the user choose between Chat Mode and Voice Mode
 * before starting the interview. Follows the same overlay/card pattern as
 * ConfirmDialog.jsx for visual consistency.
 *
 * Props:
 *   isOpen   {boolean}  — whether the dialog is visible
 *   onSelect {function} — called with "chat" or "voice" when user picks
 *   onClose  {function} — called when overlay is clicked (dismisses without selecting)
 */
function ModeSelectDialog({ isOpen, onSelect, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      {/* Stop click from bubbling to overlay */}
      <div className="dialog-content mode-dialog" onClick={(e) => e.stopPropagation()}>

        <h2 className="dialog-title">Select Interview Mode</h2>
        <p className="dialog-message">
          How would you like to take your interview?
        </p>

        <div className="mode-options">

          {/* Chat Mode */}
          <button
            className="mode-card"
            onClick={() => onSelect('chat')}
            id="mode-select-chat"
          >
            <span className="mode-card-icon">💬</span>
            <span className="mode-card-title">Chat Mode</span>
            <span className="mode-card-desc">
              Type your answers. Best for quiet environments.
            </span>
          </button>

          {/* Voice Mode */}
          <button
            className="mode-card"
            onClick={() => onSelect('voice')}
            id="mode-select-voice"
          >
            <span className="mode-card-icon">🎙️</span>
            <span className="mode-card-title">Voice Mode</span>
            <span className="mode-card-desc">
              Speak your answers. IO responses are read aloud.
            </span>
          </button>

        </div>

        <p className="mode-dialog-hint">
          Voice Mode requires microphone access and works best in Chrome / Edge.
        </p>

      </div>
    </div>
  );
}

export default ModeSelectDialog;
