import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import blackLogo from '../assets/black-background-redisphere-logo.png';

import { LOGIN_USER, LOGOUT_USER } from '../dashboardReducer.js';

const Header = () => {
  const [buttons, setButtons] = useState([]);
  const dispatch = useDispatch();

  //delete active session in db and delete ssid cookie
  //navigate back to homepage
  const navigate = useNavigate();
  const logout = async () => {
    const response = await fetch('/users/signout', {
      method: 'DELETE',
    });
    const result = await response.json();
    if (result === true) {
      dispatch(LOGOUT_USER());
      return navigate('/');
    }
    return;
  };

  const fetchSession = async () => {
    try {
      const response = await fetch('/users/session');
      const activeSession = await response.json();

      if (activeSession.session === false) {
        setButtons([
          <div key={'a'}>
            <button onClick={() => navigate('/login')}>sign in</button>
            <button onClick={() => navigate('/signup')}>sign up</button>
          </div>,
        ]);
        dispatch(LOGOUT_USER());
      } else if (activeSession.session === true) {
        setButtons([
          <div key={'b'}>
            <button onClick={() => navigate('/dashboard')}>dashboard</button>
            <button onClick={logout}>
              {'logout @'}
              <em>
                <strong>{activeSession.username}</strong>
              </em>
            </button>
          </div>,
        ]);
        dispatch(LOGIN_USER());
      }
    } catch (err) {
      return console.log(err);
    }
  };

  //empty dependency array - only triggers when header component mounts
  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <header>
      <div className="header-left">
        <a href="/">
          <img src={blackLogo}></img>
        </a>
      </div>
      <div className="header-right">
        <button onClick={() => navigate('/contact')}>contact</button>
        {buttons}
      </div>
    </header>
  );
};

export default Header;
