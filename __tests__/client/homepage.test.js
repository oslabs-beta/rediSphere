import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// component to test
// import HomePage from '../../client/components/HomePage';
// import App from '../../client/App.jsx';

xdescribe('homepage react component test', () => {
  test('Home page renders a header with the text Cache App', () => {
    // arrange
    render(<App />);

    // act
    // screen.debug();
    const heading = screen.getByRole('header');

    // assert
    expect(heading).toHaveTextContent('Cache App');
  });
});
