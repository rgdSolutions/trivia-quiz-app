import '@testing-library/jest-dom';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuizMaker } from './quiz-maker';
import { renderWithStore } from '../utils/test-helpers';
import { mockNavigate } from '../vitest.setup';
import { mockDispatch } from '../vitest.setup';

describe('QuizMaker', () => {
  it('renders all dropdowns and the create button', () => {
    renderWithStore(<QuizMaker />);
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Difficulty/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
  });

  it('shows categories in alphabetical order', async () => {
    renderWithStore(<QuizMaker />);
    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    const options = await screen.getAllByRole('option');
    // The first two options should be in alphabetical order
    expect(options[0]).toHaveTextContent('History');
    expect(options[1]).toHaveTextContent('Science');
  });

  it('disables difficulty and quantity selects until category is chosen', () => {
    renderWithStore(<QuizMaker />);
    expect(screen.getByLabelText(/Difficulty/i)).toHaveAttribute('aria-disabled');
    expect(screen.getByLabelText(/Quantity/i)).toHaveAttribute('aria-disabled');
  });

  it('enables difficulty select after category is chosen', () => {
    renderWithStore(<QuizMaker />);
    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText('Science'));
    expect(screen.getByLabelText(/Difficulty/i)).not.toBeDisabled();
  });

  it('enables quantity select after category and difficulty are chosen', () => {
    renderWithStore(<QuizMaker />);
    // Select category
    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText('Science'));
    // Select difficulty
    fireEvent.mouseDown(screen.getByLabelText(/Difficulty/i));
    fireEvent.click(screen.getByText('easy'));
    expect(screen.getByLabelText(/Quantity/i)).not.toBeDisabled();
  });

  it('enables create button only when all selections are made', () => {
    renderWithStore(<QuizMaker />);
    const createButton = screen.getByRole('button', { name: /Create/i });
    expect(createButton).toBeDisabled();

    // Select category
    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText('Science'));
    // Select difficulty
    fireEvent.mouseDown(screen.getByLabelText(/Difficulty/i));
    fireEvent.click(screen.getByText('easy'));
    // Select quantity
    fireEvent.mouseDown(screen.getByLabelText(/Quantity/i));
    fireEvent.click(screen.getByText('Three'));

    expect(createButton).not.toBeDisabled();
  });

  it('dispatches createQuiz and navigates when Create is clicked', () => {
    renderWithStore(<QuizMaker />);
    // Select category
    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText('Science'));
    // Select difficulty
    fireEvent.mouseDown(screen.getByLabelText(/Difficulty/i));
    fireEvent.click(screen.getByText('easy'));
    // Select quantity
    fireEvent.mouseDown(screen.getByLabelText(/Quantity/i));
    fireEvent.click(screen.getByText('Three'));

    const createButton = screen.getByRole('button', { name: /Create/i });
    fireEvent.click(createButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/quiz');
  });
});
