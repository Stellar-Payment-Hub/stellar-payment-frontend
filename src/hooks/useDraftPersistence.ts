import { useState, useEffect } from 'react';

export function useDraftPersistence<T>(key: string, initialValue: T): [T, (val: T) => void, () => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const saved = localStorage.getItem(`sph_draft_${key}`);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`sph_draft_${key}`, JSON.stringify(value));
    } catch {
      //
    }
  }, [key, value]);

  const clear = () => {
    setValue(initialValue);
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.removeItem === 'function') {
        window.localStorage.removeItem(`sph_draft_${key}`);
      }
    } catch {
      //
    }
  };

  return [value, setValue, clear];
}
