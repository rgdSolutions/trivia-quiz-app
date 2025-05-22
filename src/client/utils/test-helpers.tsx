import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import { Provider } from "react-redux";
import { render, renderHook } from "@testing-library/react";
import quizReducer, { type QuizState } from '../redux/slices/quiz';

export const baseQuizState: QuizState = {
  selectedAnswers: ['', '', '', ''],
  correctAnswers: ['', '', '', ''],
  numberOfQuestions: 4,
  questions: [],
};

export const renderWithStore = (ui: React.ReactNode, preloadedState: QuizState = baseQuizState) => {
  const store = configureStore({
    reducer: { quiz: quizReducer },
    preloadedState: { quiz: preloadedState },
  });
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}

export const renderHookWithProvider = (hook: () => any, preloadedState: QuizState = baseQuizState) => {
  const store = configureStore({
    reducer: { quiz: quizReducer },
    preloadedState: { quiz: preloadedState },
  });
  return renderHook(hook, { wrapper: ({ children }) => <Provider store={store}>{children}</Provider> });
}