'use client';

import { Provider } from 'react-redux';
import { store, RootState } from '@/redux/store';
import { useRef } from 'react';
import { Store } from '@reduxjs/toolkit';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<Store<RootState> | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = store;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}