import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuizTaker } from './quiz-taker';
import { mockNavigate } from '../vitest.setup';

const mockDispatch = vi.fn();
const mockSendQuizAnswers = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (fn: any) =>
    fn({
      quiz: {
        category: undefined,
        difficulty: undefined,
        numberOfQuestions: undefined,
        selectedAnswers: [],
        correctAnswers: [],
        score: undefined,
      },
    }),
}));

vi.mock('../redux/api/trivia', () => ({
  useGetQuestionsByCategoryDifficultyAndCountQuery: () => ({
    data: [
      { question: 'Q1', possible_answers: ['A', 'B', 'C', 'D'] },
      { question: 'Q2', possible_answers: ['A', 'B', 'C', 'D'] },
      { question: 'Q3', possible_answers: ['A', 'B', 'C', 'D'] },
      { question: 'Q4', possible_answers: ['A', 'B', 'C', 'D'] },
    ],
  }),
  useSendQuizAnswersMutation: () => [mockSendQuizAnswers],
}));

describe('QuizTaker missing state', () => {
  it('redirects to home if quiz is not set', () => {
    render(<QuizTaker />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
