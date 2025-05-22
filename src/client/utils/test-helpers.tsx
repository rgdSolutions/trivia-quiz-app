import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { mockQuizQuestions } from './network-mock-helpers';
import quizReducer, { type QuizState } from '../redux/slices/quiz';
import { triviaApi } from '../redux/api/trivia';
import { BrowserRouter } from 'react-router';

export const baseQuizState: QuizState = {
  category: '',
  difficulty: undefined,
  numberOfQuestions: 4,
  questions: mockQuizQuestions,
  selectedAnswers: ['', '', '', ''],
  correctAnswers: ['', '', '', ''],
  score: undefined,
};

export const renderWithStore = (ui: React.ReactNode, preloadedState: QuizState = baseQuizState) => {
  const store = configureStore({
    reducer: {
      quiz: quizReducer,
      [triviaApi.reducerPath]: triviaApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(triviaApi.middleware),
    preloadedState: {
      quiz: preloadedState,
    },
  });
  return {
    ...render(
      <BrowserRouter>
        <ReduxProvider store={store}>{ui}</ReduxProvider>
      </BrowserRouter>,
    ),
    store,
  };
};
