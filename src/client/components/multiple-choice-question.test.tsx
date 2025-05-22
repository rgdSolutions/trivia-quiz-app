import '@testing-library/jest-dom';
import { screen, fireEvent, renderHook } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { MultipleChoiceQuestion } from './multiple-choice-question';
import type { QuizState } from '../redux/slices/quiz';
import { baseQuizState, renderWithStore } from '../utils/test-helpers';
import { mockDispatch } from '../vitest.setup';

const mockQuestion = {
  question: 'What is 2 + 2?',
  possible_answers: ['3', '4', '5', '6'],
};

describe('MultipleChoiceQuestion', () => {
  it('renders the question and all possible answers', () => {
    renderWithStore(<MultipleChoiceQuestion item={mockQuestion} index={0} />);
    expect(screen.getByText('1. What is 2 + 2?')).toBeInTheDocument();
    mockQuestion.possible_answers.forEach((ans) => {
      expect(screen.getByText(ans)).toBeInTheDocument();
    });
  });

  it('dispatches selectAnswer when an answer is clicked and quiz is not yet scored', () => {
    mockDispatch.mockClear();
    renderWithStore(<MultipleChoiceQuestion item={mockQuestion} index={0} />);
    fireEvent.click(screen.getByText('4'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('does not dispatch selectAnswer if quiz is already scored', () => {
    mockDispatch.mockClear();
    const scoredState: QuizState = {
      ...baseQuizState,
      selectedAnswers: ['4', '', '', ''],
      correctAnswers: ['4', '', '', ''],
    };
    renderWithStore(<MultipleChoiceQuestion item={mockQuestion} index={0} />, scoredState);
    const answerButton = screen.getByText('4');
    fireEvent.click(answerButton);
    // Should not dispatch because quiz is scored
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('shows correct styling for selected and correct answers', () => {
    const scoredState: QuizState = {
      ...baseQuizState,
      selectedAnswers: ['3', '', '', ''],
      correctAnswers: ['4', '', '', ''],
    };
    renderWithStore(<MultipleChoiceQuestion item={mockQuestion} index={0} />, scoredState);
    // The correct answer should have color 'success'
    const correctButton = screen.getByText('4');
    expect(correctButton).toHaveClass('MuiButton-contained');
    // The selected (but incorrect) answer should have color 'error'
    const selectedButton = screen.getByText('3');
    expect(selectedButton).toHaveClass('MuiButton-contained');
  });

  it('decodes HTML entities in question and answers', () => {
    const htmlQuestion = {
      question: 'Who is considered the &quot;Father of Modern Philosophy&quot;?',
      possible_answers: ['Ren&eacute; Descartes', 'Plato', 'Aristotle', 'Socrates'],
    };
    renderWithStore(<MultipleChoiceQuestion item={htmlQuestion} index={0} />);
    expect(screen.getByText(/Father of Modern Philosophy/)).toBeInTheDocument();
    expect(screen.getByText('René Descartes')).toBeInTheDocument();
  });
});
