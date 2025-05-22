import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Category, QuizQuestion, Difficulty } from '@shared/types';

// baseUrl is set to /api in development and http://localhost/api in the test environment
// to avoid errors from network requests in tests
let isVitest = false;
if (typeof process !== 'undefined') {
  isVitest = process?.env?.VITEST === 'true';
}

export const triviaApi = createApi({
  reducerPath: 'triviaApi',
  baseQuery: fetchBaseQuery({ baseUrl: isVitest ? 'http://localhost/api' : '/api' }),
  endpoints: (builder) => ({
    getAllCategories: builder.query<Category[], void>({
      query: () => `categories`,
    }),
    getDifficultiesByCategory: builder.query<Difficulty[], { category: string }>({
      query: ({ category }) => `difficulties/${category}`,
    }),
    getQuestionsCountByCategoryAndDifficulty: builder.query<
      { question_count: number },
      { category: string; difficulty: Difficulty }
    >({
      query: ({ category, difficulty }) => `questions/${category}/${difficulty}/count`,
    }),
    getQuestionsByCategoryDifficultyAndCount: builder.query<
      QuizQuestion[],
      { category: string; difficulty: Difficulty; count: number }
    >({
      query: ({ category, difficulty, count }) => `quiz/${category}/${difficulty}/${count}`,
    }),
    sendQuizAnswers: builder.mutation<
      { score: number; correct_answers: string[] },
      { questions: QuizQuestion[]; selectedAnswers: string[] }
    >({
      query: ({ questions, selectedAnswers }) => ({
        url: 'quiz/score',
        method: 'POST',
        body: { questions, selected_answers: selectedAnswers },
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetDifficultiesByCategoryQuery,
  useGetQuestionsCountByCategoryAndDifficultyQuery,
  useGetQuestionsByCategoryDifficultyAndCountQuery,
  useSendQuizAnswersMutation,
} = triviaApi;
