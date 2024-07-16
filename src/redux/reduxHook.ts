import { useEffect, useState } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import cvReducer from './cvSlice';
import { loadFromLocalStorage } from '../utils/localStorage';
import debouncedSave from '@/utils/debounced';

export const useHydratedStore = () => {
  const [store, setStore] = useState(() =>
    configureStore({
      reducer: {
        cv: cvReducer,
      },
    })
  );

  useEffect(() => {
    const preloadedState = loadFromLocalStorage();
    const hydratedStore = configureStore({
      reducer: {
        cv: cvReducer,
      },
      preloadedState: preloadedState ? { cv: preloadedState } : undefined,
    });

    hydratedStore.subscribe(() => {
      debouncedSave(hydratedStore.getState().cv);
    });

    setStore(hydratedStore);
  }, []);

  return store;
};