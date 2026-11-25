import { useCallback, useEffect, useState } from 'react';
import { BouquetDesign } from '../types/bouquet';
import { DEFAULT_BOUQUET, loadDraftDesign, saveDraftDesign } from '../lib/storage';

interface HistoryState {
  past: BouquetDesign[];
  present: BouquetDesign;
  future: BouquetDesign[];
}

export function useBouquetHistory() {
  const [history, setHistory] = useState<HistoryState>(() => ({
    past: [],
    present: loadDraftDesign() ?? DEFAULT_BOUQUET,
    future: [],
  }));

  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const ok = saveDraftDesign(history.present);
    if (ok) {
      setLastSavedAt(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
    }
  }, [history.present]);

  const setDesign = useCallback((updater: BouquetDesign | ((prev: BouquetDesign) => BouquetDesign)) => {
    setHistory((curr) => {
      const next = typeof updater === 'function' ? updater(curr.present) : updater;
      if (next === curr.present) return curr;
      return {
        past: [...curr.past.slice(-24), curr.present],
        present: next,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((curr) => {
      if (curr.past.length === 0) return curr;
      const previous = curr.past[curr.past.length - 1];
      return {
        past: curr.past.slice(0, -1),
        present: previous,
        future: [curr.present, ...curr.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((curr) => {
      if (curr.future.length === 0) return curr;
      const next = curr.future[0];
      return {
        past: [...curr.past, curr.present],
        present: next,
        future: curr.future.slice(1),
      };
    });
  }, []);

  return {
    design: history.present,
    setDesign,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    lastSavedAt,
  };
}
