'use client';

import { Provider } from 'react-redux';
import { store } from '../redux/store';
import CVEditor from '@/components/CVEditor';
import CVPreview from '@/components/CVPreview';

export default function Home() {
  return (
    <Provider store={store}>
      <main className="flex min-h-screen">
        <div className="w-1/2 p-4 bg-gray-100">
          <CVEditor />
        </div>
        <div className="w-1/2 p-4">
          <CVPreview />
        </div>
      </main>
    </Provider>
  );
}