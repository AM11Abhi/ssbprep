/**
 * TEMP MOCK DATA INDICATOR — REMOVE WHEN BACKEND IS RUNNING
 * 
 * Shows a subtle label when mock data is in use.
 * Only visible when usingMock prop is true.
 */

function MockDataIndicator({ usingMock }) {
  if (!usingMock) return null;

  return (
    <div className="mock-data-indicator">
      Mock data in use
    </div>
  );
}

export default MockDataIndicator;
