import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { Page } from './page';

describe('Page component', () => {
  it('renders children inside CardContent', () => {
    render(
      <Page title='Test Title'>
        <div data-testid='child-content'>Hello World</div>
      </Page>,
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies custom sx prop to the outer Box', () => {
    render(
      <Page title='Styled Page' sx={{ backgroundColor: 'rgb(255, 0, 0)' }}>
        Custom Style
      </Page>,
    );
    const container = screen.getByTestId('page-container');
    expect(container).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
  });

  it('defaults to width 100% if no sx prop is provided', () => {
    render(<Page title='Default Width'>Default</Page>);
    const container = screen.getByTestId('page-container');
    expect(container).toHaveStyle({ width: '100%' });
  });
});
