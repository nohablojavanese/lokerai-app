import { debounce } from 'lodash';
import { saveToLocalStorage } from '../utils/localStorage';
import { CVState } from '../redux/cvSlice';

const debouncedSave = debounce((state: CVState) => {
  saveToLocalStorage(state);
}, 1000);

export default debouncedSave;
