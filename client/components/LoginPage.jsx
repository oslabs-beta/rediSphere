import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SET_USER } from '../dashboardReducer.js';
import { useDispatch } from 'react-redux';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = async () => {
    const data = {};
    data.username = document.getElementById('username').value;
    data.password = document.getElementById('password').value;

    const response = await fetch('/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result === 'not ok') return alert('login failed. try again.');
    if (result === 'ok') {
      dispatch(SET_USER(data.username));
      return navigate('/dashboard');
    }
  };

  return (
    <div>
      <h2>{'Sign in to Cache App'}</h2>

      <div className="login-box">
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
            <input type="password" id="password" />
          </label>
        </div>

        <button id="login-button" onClick={handleClick}>
          Sign in
        </button>
      </div>

      <div>
        {'New to Cache App? '}
        <a href="/signup">Create an account</a>
      </div>
    </div>
  );
};

export default LoginPage;
