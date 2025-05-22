import { configureStore } from '@reduxjs/toolkit';
import { triviaApi } from './api/trivia';
import quizReducer from './slices/quiz';

export const store = configureStore({
  reducer: {
    [triviaApi.reducerPath]: triviaApi.reducer,
    quiz: quizReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(triviaApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
