import { useState } from 'react';

const useStorage = (key: string, initialValue: any = '') => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return window.localStorage.getItem(key) || initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      let valueToStore = value;
      if (value instanceof Function) {
        valueToStore = value(storedValue);
      }
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    }
  };

  const clearStorage = () => {
    window.localStorage.clear();
  };

  return [storedValue, setValue, clearStorage];
};

export default useStorage;
