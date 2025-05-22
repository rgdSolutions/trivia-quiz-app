import type { Category, QuizQuestion } from '@shared/types';
import { Difficulty } from '@shared/types';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  http.get(/\/api\/categories$/, () => {
    return HttpResponse.json(mockCategories);
  }),
  http.get(/\/api\/difficulties(\/.*)?$/, () => {
    return HttpResponse.json(mockDifficulties);
  }),
  http.get(/\/api\/questions(\/.*)?$/, () => {
    return HttpResponse.json(mockQuizQuestions);
  }),
];

export const server = setupServer(...handlers);

export const mockCategories: Category[] = [
  { id: 1, name: 'Science' },
  { id: 2, name: 'History' },
];

export const mockDifficulties: Difficulty[] = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    question: 'What is the capital of France?',
    possible_answers: ['Paris', 'London', 'Berlin', 'Madrid'],
  },
  {
    question: 'What is the capital of Germany?',
    possible_answers: ['Berlin', 'Paris', 'Madrid', 'London'],
  },
  {
    question: 'What is the capital of Italy?',
    possible_answers: ['Rome', 'Paris', 'Madrid', 'London'],
  },
  {
    question: 'What is the capital of Spain?',
    possible_answers: ['Madrid', 'Paris', 'Berlin', 'London'],
  },
];
