import { configureStore } from '@reduxjs/toolkit';
import { triviaApi } from './api/trivia';

export const store = configureStore({
  reducer: {
    [triviaApi.reducerPath]: triviaApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(triviaApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
