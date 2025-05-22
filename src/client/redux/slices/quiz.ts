import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Difficulty, QuizQuestion } from '@shared/types';
import { triviaApi } from '../api/trivia';

export type QuizState = {
  category?: string;
  difficulty?: Difficulty;
  numberOfQuestions: number;
  questions: QuizQuestion[];
  selectedAnswers: string[];
  correctAnswers: string[];
  score?: number;
};

const initialState: QuizState = {
  category: undefined,
  difficulty: undefined,
  numberOfQuestions: 0,
  questions: [],
  selectedAnswers: [],
  correctAnswers: [],
  score: undefined,
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearQuiz: (state) => {
      state.category = initialState.category;
      state.difficulty = initialState.difficulty;
      state.numberOfQuestions = initialState.numberOfQuestions;
      state.questions = initialState.questions;
      state.selectedAnswers = initialState.selectedAnswers;
      state.correctAnswers = initialState.correctAnswers;
      state.score = initialState.score;
    },
    createQuiz: (
      state,
      action: PayloadAction<{
        category: string;
        difficulty: Difficulty;
        numberOfQuestions: number;
      }>,
    ) => {
      state.category = action.payload.category;
      state.difficulty = action.payload.difficulty;
      state.numberOfQuestions = action.payload.numberOfQuestions;
      state.selectedAnswers = Array(action.payload.numberOfQuestions).fill('');
    },
    selectAnswer: (state, action: PayloadAction<{ index: number; answer: string }>) => {
      state.selectedAnswers[action.payload.index] = action.payload.answer;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(triviaApi.endpoints.sendQuizAnswers.matchFulfilled, (state, { payload }) => {
      state.correctAnswers = payload.correct_answers;
      state.score = payload.score;
    });
  },
});

export const { clearQuiz, createQuiz, selectAnswer } = quizSlice.actions;

export default quizSlice.reducer;
