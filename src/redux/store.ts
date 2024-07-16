import { configureStore } from '@reduxjs/toolkit';
import cvReducer from './cvSlice';
import { loadFromLocalStorage } from '../utils/localStorage';
import debouncedSave from '@/utils/debounced';

const createStore = (preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      cv: cvReducer,
    },
    preloadedState,
  });

  if (typeof window !== 'undefined') {
    store.subscribe(() => {
      debouncedSave(store.getState().cv);
    });
  }

  return store;
};

export const store = createStore();

// Client-side store initialization
if (typeof window !== 'undefined') {
  const preloadedState = loadFromLocalStorage();
  if (preloadedState) {
    store.dispatch({ type: 'cv/hydrate', payload: preloadedState });
  }
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;