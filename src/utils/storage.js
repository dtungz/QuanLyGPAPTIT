// LocalStorage helper with JSON serialization
const STORAGE_PREFIX = 'gpa-manager-';

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing ${key} to localStorage:`, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch (e) {
      return false;
    }
  },

  clear() {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
      keys.forEach(k => localStorage.removeItem(k));
      return true;
    } catch (e) {
      return false;
    }
  },

  exportAll() {
    const data = {};
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => {
        try {
          data[k.replace(STORAGE_PREFIX, '')] = JSON.parse(localStorage.getItem(k));
        } catch {
          data[k.replace(STORAGE_PREFIX, '')] = localStorage.getItem(k);
        }
      });
    return data;
  },

  importAll(data) {
    try {
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      });
      return true;
    } catch (e) {
      console.error('Error importing data:', e);
      return false;
    }
  },
};
