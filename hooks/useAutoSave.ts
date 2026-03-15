'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface DraftData {
  content: string;
  title: string;
  tags: string;
  timestamp: number;
}

interface UseAutoSaveOptions {
  key: string;
  interval?: number;
  onSave?: (data: DraftData) => void;
  onRestore?: (data: DraftData) => void;
}

export function useAutoSave(options: UseAutoSaveOptions) {
  const { key, interval = 3000, onSave, onRestore } = options;
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced save function
  const debouncedSave = useCallback(
    (content: string, title: string, tags: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const draft: DraftData = {
          content,
          title,
          tags,
          timestamp: Date.now(),
        };

        try {
          localStorage.setItem(key, JSON.stringify(draft));
          setIsDraftSaved(true);
          setLastSavedAt(new Date());
          onSave?.(draft);
        } catch (error) {
          console.error('Failed to save draft:', error);
        }
      }, interval);
    },
    [key, interval, onSave]
  );

  // Restore draft from localStorage
  const restoreDraft = useCallback((): DraftData | null => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const draft: DraftData = JSON.parse(saved);
        const age = Date.now() - draft.timestamp;

        // Only restore if draft is less than 7 days old
        if (age < 7 * 24 * 60 * 60 * 1000) {
          onRestore?.(draft);
          setLastSavedAt(new Date(draft.timestamp));
          return draft;
        } else {
          // Clear old draft
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Failed to restore draft:', error);
    }
    return null;
  }, [key, onRestore]);

  // Check if draft exists
  const hasDraft = useCallback((): boolean => {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }, [key]);

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setIsDraftSaved(false);
      setLastSavedAt(null);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, [key]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    debouncedSave,
    restoreDraft,
    clearDraft,
    hasDraft,
    isDraftSaved,
    lastSavedAt,
  };
}
