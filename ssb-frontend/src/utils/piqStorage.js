const STORAGE_KEY = 'ssb_piq_v1';

export const getPIQ = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const savePIQ = (piq) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(piq));
};

export const clearPIQ = () => {
  localStorage.removeItem(STORAGE_KEY);
};
