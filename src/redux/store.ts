import { configureStore } from '@reduxjs/toolkit';
import cvReducer from './cvSlice';
import { loadFromLocalStorage } from '../utils/localStorage';
// import debouncedSave from '@/utils/debounced';

const preloadedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    cv: cvReducer,
  },
//   preloadedState: preloadedState ? { cv: preloadedState } : undefined,
// });

// store.subscribe(() => {
//   debouncedSave(store.getState().cv);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
