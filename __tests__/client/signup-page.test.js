import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// component to test
import { BrowserRouter } from 'react-router-dom';
import SignupPage from '../../client/components/SignupPage';

describe('homepage react component test', () => {
  test('Home page renders a header with the text Cache App', () => {
    // arrange
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>,
    );

    // act
    const heading = screen.getByText('Sign up for Cache App');

    // assert
    expect(heading).toHaveTextContent('Sign up for Cache App');
  });

  test('Form input elements should have labels, and there should be a button to submit our form', () => {
    // arrange
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>,
    );

    // act
    const userNameLabel = screen.getByLabelText('Username');
    const passwordLabel = screen.getByLabelText('Password');
    const passwordConfirmationLabel = screen.getByLabelText('Confirm Password');

    const formSubmitButton = screen.getByText("Let's go!");

    // assert
    expect(userNameLabel).toBeVisible();
    expect(passwordLabel).toBeVisible();
    expect(passwordConfirmationLabel).toBeVisible();
    expect(formSubmitButton).toBeInTheDocument();
  });
});
