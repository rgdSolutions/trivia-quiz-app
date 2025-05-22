import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { describe, it, expect, vi } from 'vitest';
import { MultipleChoiceQuestion } from './multiple-choice-question';
import type { QuizState } from '../redux/slices/quiz';
import { baseQuizState, renderHookWithProvider, renderWithStore } from '../utils/test-helpers';

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
    renderWithStore(<MultipleChoiceQuestion item={mockQuestion} index={0} />);
    const { result } = renderHookWithProvider(useDispatch);
    fireEvent.click(screen.getByText('4'));
    expect(result.current).toHaveBeenCalled();
  });

  it('does not dispatch selectAnswer if quiz is already scored', () => {
    const scoredState: QuizState = {
      ...baseQuizState,
      selectedAnswers: ['4', '', '', ''],
      correctAnswers: ['4', '', '', ''],
    };
    const { store } = renderWithStore(<MultipleChoiceQuestion item={mockQuestion} index={0} />, scoredState);
    const spy = vi.spyOn(store, 'dispatch');
    const answerButton = screen.getByText('4');
    fireEvent.click(answerButton);
    // Should not dispatch because quiz is scored
    expect(spy).not.toHaveBeenCalled();
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
