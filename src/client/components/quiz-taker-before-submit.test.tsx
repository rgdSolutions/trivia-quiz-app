import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
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
        category: 'Science',
        difficulty: 'easy',
        numberOfQuestions: 4,
        selectedAnswers: ['', '', '', ''],
        correctAnswers: ['', '', '', ''],
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

vi.mock('../redux/slices/quiz', () => ({
  clearQuiz: () => ({ type: 'quiz/clearQuiz' }),
}));

describe('QuizTaker before submit', () => {
  it('renders all questions and the submit button', () => {
    render(<QuizTaker />);
    expect(screen.getByText('Science Quiz')).toBeInTheDocument();
    expect(screen.getAllByText(/Q[1-4]/)).toHaveLength(4);
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('disables submit button if not all questions are answered', () => {
    render(<QuizTaker />);
    expect(
      screen.getByRole('button', { name: /Answer all questions before submitting/i }),
    ).toBeDisabled();
  });
});
