// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import your slice

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add your reducer here
  },
});
