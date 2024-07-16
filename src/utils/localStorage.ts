import { CVState } from '../redux/cvSlice';

export const saveToLocalStorage = (state: CVState) => {
  try {
    const serializedState = JSON.stringify(state);
    window.localStorage.setItem('cv_data', serializedState);
  } catch (e) {
    console.error('Could not save state to localStorage:', e);
  }
};

export const loadFromLocalStorage = (): CVState | undefined => {
  try {
    const serializedState = window.localStorage.getItem('cv_data');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Could not load state from localStorage:', e);
    return undefined;
  }
};
