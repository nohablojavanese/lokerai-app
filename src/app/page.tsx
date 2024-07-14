'use client';

import { Provider } from 'react-redux';
import { store } from '../redux/store';
import CVEditor from '../components/CVEditor';
import CVPreview from '../components/CVPreview';

export default function Home() {
  return (
    <Provider store={store}>
      
      <main className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 p-6 bg-white dark:bg-gray-900 overflow-y-auto">
      <CVEditor />
        </div>
        <div className="w-full md:w-1/2 p-4 bg-white dark:bg-gray-800 overflow-y-auto">
          <CVPreview />
        </div>
      </main>
    </Provider>
  );
}