import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Category, Question } from '@shared/types';

export const triviaApi = createApi({
  reducerPath: 'triviaApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getAllCategories: builder.query<Category[], void>({
      query: () => `categories`,
    }),
    getDifficultiesByCategory: builder.query<string[], { category: string }>({
      query: ({ category }) => `categories/${category}/difficulties`,
    }),
    getQuestionsByCategoryAndDifficulty: builder.query<
      Question[],
      { category: string; difficulty: string }
    >({
      query: ({ category, difficulty }) => `categories/${category}/${difficulty}/questions`,
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetDifficultiesByCategoryQuery,
  useGetQuestionsByCategoryAndDifficultyQuery,
} = triviaApi;
