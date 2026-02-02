const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  wat: () => `${API_BASE_URL}/content/wat`,
  srt: () => `${API_BASE_URL}/content/srt`,
  tat: () => `${API_BASE_URL}/content/tat`,
  sdt: () => `${API_BASE_URL}/content/sdt`,
  lecturette: () => `${API_BASE_URL}/content/lecturette`,
};