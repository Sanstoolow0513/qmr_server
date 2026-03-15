'use client';

import { useState, useCallback, useRef } from 'react';

interface HistoryState {
  content: string;
  title: string;
  tags: string;
}

interface UseUndoRedoOptions {
  maxHistory?: number;
}

export function useUndoRedo(options: UseUndoRedoOptions = {}) {
  const { maxHistory = 50 } = options;
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const lastStateRef = useRef<HistoryState | null>(null);

  // Save state to history
  const saveState = useCallback(
    (content: string, title: string, tags: string) => {
      const newState: HistoryState = { content, title, tags };

      // Don't save if state hasn't changed
      if (
        lastStateRef.current &&
        lastStateRef.current.content === content &&
        lastStateRef.current.title === title &&
        lastStateRef.current.tags === tags
      ) {
        return;
      }

      // Remove any future history if we're not at the end
      const newHistory = history.slice(0, currentIndex + 1);

      // Add new state
      newHistory.push(newState);

      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift();
      }

      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
      lastStateRef.current = newState;
    },
    [history, currentIndex, maxHistory]
  );

  // Undo
  const undo = useCallback((): HistoryState | null => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      lastStateRef.current = history[newIndex];
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  // Redo
  const redo = useCallback((): HistoryState | null => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      lastStateRef.current = history[newIndex];
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  // Check if can undo/redo
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
