const MODE_KEY = 'interviewMode';

/**
 * Returns the stored interview mode: "chat" | "voice" | null
 */
export function getInterviewMode() {
  return localStorage.getItem(MODE_KEY);
}

/**
 * Stores the interview mode.
 * @param {'chat'|'voice'} mode
 */
export function setInterviewMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
}

/**
 * Clears the stored mode (e.g. when clearing PIQ).
 */
export function clearInterviewMode() {
  localStorage.removeItem(MODE_KEY);
}
