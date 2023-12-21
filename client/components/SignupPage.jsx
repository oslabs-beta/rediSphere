import React from 'react';
import { useNavigate } from 'react-router-dom';

import Footer from './Footer';

const SignupPage = () => {
  const navigate = useNavigate();
  const handleClick = async () => {
    if (document.getElementById('password-1').value !== document.getElementById('password-2').value)
      return alert('passwords do not match. please try again.');

    const data = {};
    data.username = document.getElementById('username').value;
    data.password = document.getElementById('password-1').value;

    const response = await fetch('/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result === 'ok') return navigate('/connectredis');

    if (result === 'username taken')
      return alert('That username has been taken. Please choose another.');
  };

  return (
    <div>
      <h2>{'Sign up for Cache App'}</h2>

      <div className="signup-box">
        <div>
          <label>
            Username
            <br></br>
            <input type="text" id="username" />
          </label>
        </div>
        <div>
          <label>
            Password
            <br></br>
            <input type="password" id="password-1" />
          </label>
        </div>
        <div>
          <label>
            Confirm password
            <br></br>
            <input type="password" id="password-2" />
          </label>
        </div>
        <button id="signup-button" onClick={handleClick}>
          Let's go!
        </button>
      </div>

      <div>
        {'Already have an account? '}
        <a href="/login">Log in here</a>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;
