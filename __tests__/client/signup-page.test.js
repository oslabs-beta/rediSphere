import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// component to test
import { BrowserRouter } from 'react-router-dom';
import SignupPage from '../../client/components/SignupPage';

describe('signup page react component test', () => {
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
    const passwordConfirmationLabel = screen.getByLabelText('Confirm password');
    const formSubmitButton = screen.getByText("Let's go!");

    // assert
    expect(userNameLabel).toBeVisible();
    expect(passwordLabel).toBeVisible();
    expect(passwordConfirmationLabel).toBeVisible();
    expect(formSubmitButton).toBeInTheDocument();
  });
});
