// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import your slice
import exp from 'constants';

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add your reducer here
  },
});
export type RootState = ReturnType<typeof store.getState>;
