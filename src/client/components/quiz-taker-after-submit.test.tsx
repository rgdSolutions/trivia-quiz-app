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
        category: 'Science',
        difficulty: 'easy',
        numberOfQuestions: 4,
        selectedAnswers: ['A', 'B', 'C', 'D'],
        correctAnswers: ['A', 'B', 'C', 'D'],
        score: 4,
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

describe('QuizTaker after submit', () => {
  it('shows header, all questions, the score and the start new quiz button after submission', async () => {
    render(<QuizTaker />);
    expect(screen.getByText('Science Quiz')).toBeInTheDocument();
    expect(screen.getAllByText(/Q[1-4]/)).toHaveLength(4);
    expect(screen.getByText(/You scored 4 out of 4/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start new quiz/i })).toBeInTheDocument();
  });

  it('dispatches clearQuiz and navigates home when Start new quiz is clicked', () => {
    render(<QuizTaker />);
    fireEvent.click(screen.getByRole('button', { name: /Start new quiz/i }));
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
