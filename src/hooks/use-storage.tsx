import { useCallback, useEffect, useState } from "react";

// Check if we're in a Chrome extension environment
const isExtension = !!chrome?.storage;

/**
 * A hook that provides a unified storage API for both Chrome extension and web environments
 * Uses chrome.storage.sync in extension environment and localStorage in development
 */
export function useStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  // Load initial value from storage
  useEffect(() => {
    const loadValue = async () => {
      try {
        if (isExtension) {
          // Chrome extension environment
          const result = await chrome.storage.sync.get([key]);
          setValue(result[key] !== undefined ? result[key] : initialValue);
        } else {
          // Development environment
          const storedValue = localStorage.getItem(key);
          setValue(
            storedValue !== null ? JSON.parse(storedValue) : initialValue
          );
        }
      } catch (error) {
        console.error(`Error loading value for ${key}:`, error);
        setValue(initialValue);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key, initialValue]);

  // Update value in storage
  const updateValue = useCallback(
    async (newValue: T) => {
      try {
        if (isExtension) {
          // Chrome extension environment
          await chrome.storage.sync.set({ [key]: newValue });
        } else {
          // Development environment
          localStorage.setItem(key, JSON.stringify(newValue));
        }
        setValue(newValue);
      } catch (error) {
        console.error(`Error saving value for ${key}:`, error);
        throw error;
      }
    },
    [key]
  );

  return [value, updateValue, loading];
}
