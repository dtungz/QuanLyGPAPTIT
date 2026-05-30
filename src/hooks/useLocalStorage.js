import { useState, useEffect, useCallback } from 'react';

const STORAGE_PREFIX = 'gpa-manager-';

export function useLocalStorage(key, initialValue) {
  const prefixedKey = STORAGE_PREFIX + key;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
      // Dispatch custom event for cross-component sync
      window.dispatchEvent(new CustomEvent('local-storage-change', {
        detail: { key, value: valueToStore }
      }));
    } catch (error) {
      console.error(`Error writing ${key}:`, error);
    }
  }, [key, prefixedKey, storedValue]);

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(prefixedKey);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }, [key, prefixedKey, initialValue]);

  // Listen for changes from other tabs/components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === prefixedKey) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch {
          setStoredValue(initialValue);
        }
      }
    };

    const handleCustomChange = (e) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-change', handleCustomChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-change', handleCustomChange);
    };
  }, [key, prefixedKey, initialValue]);

  return [storedValue, setValue, removeValue];
}
