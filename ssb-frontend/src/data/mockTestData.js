/**
 * TEMP MOCK DATA — REMOVE WHEN BACKEND IS RUNNING
 * 
 * This file contains mock data for previewing tests without a backend.
 * To disable mock data and use only the backend:
 * - Set USE_MOCK_DATA to false
 * - Or delete this file and remove imports from test components
 */

// Toggle this to disable mock data fallback
export const USE_MOCK_DATA = true;

// TEMP MOCK DATA — REMOVE WHEN BACKEND IS RUNNING
export const MOCK_WAT_DATA = {
  testType: "WAT",
  count: 5,
  items: [
    { id: 1, word: "Leader" },
    { id: 2, word: "Failure" },
    { id: 3, word: "Duty" },
    { id: 4, word: "Pressure" },
    { id: 5, word: "Success" }
  ]
};

// TEMP MOCK DATA — REMOVE WHEN BACKEND IS RUNNING
export const MOCK_TAT_DATA = {
  testType: "TAT",
  items: [
    { id: 1, code: "TAT_01", isBlank: false },
    { id: 2, code: "TAT_02", isBlank: false },
    { id: 3, code: "BLANK", isBlank: true }
  ]
};

// TEMP MOCK DATA — REMOVE WHEN BACKEND IS RUNNING
export const MOCK_SRT_DATA = {
  testType: "SRT",
  count: 3,
  items: [
    { id: 1, situation: "You are late for an important task." },
    { id: 2, situation: "A teammate is not cooperating." },
    { id: 3, situation: "You notice unsafe behavior at work." }
  ]
};

// TEMP MOCK DATA — REMOVE WHEN BACKEND IS RUNNING
export const MOCK_SDT_DATA = {
  testType: "SDT",
  headings: [
    "Parents",
    "Teachers",
    "Friends",
    "Self",
    "Others"
  ]
};

// TEMP MOCK DATA — REMOVE WHEN BACKEND IS RUNNING
export const MOCK_LECTURETTE_DATA = {
  testType: "LECTURETTE",
  items: [
    { id: 1, topic: "Role of Youth in Nation Building" },
    { id: 2, topic: "Importance of Discipline" },
    { id: 3, topic: "Leadership in Modern India" },
    { id: 4, topic: "Technology in Defence" }
  ]
};
