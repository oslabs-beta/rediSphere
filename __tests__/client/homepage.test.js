import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('homepage react component test', () => {
  test('Home page renders a header with the text contact', () => {
    render(<App />);
    const heading = screen.getByRole('header');
    expect(heading).toHaveTextContent('contact');
  });
});
