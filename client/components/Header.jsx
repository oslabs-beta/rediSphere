import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SET_USER } from '../dashboardReducer.js';

const Header = () => {
  const [buttons, setButtons] = useState([]);

  //delete active session in db and delete ssid cookie
  //navigate back to homepage
  const navigate = useNavigate();
  const logout = async () => {
    const response = await fetch('/users/signout', {
      method: 'DELETE',
    });
    const result = await response.json();
    if (result === true) return navigate('/');
    return;
  };

  //check if there is an active session before loading header
  //if active Session, fetch username based on ssid cookie and dispatch to store in state
  //   const dispatch = useDispatch();

  //   const fetchUsername = async () => {
  //     try {
  //       const response = await fetch('/users/whoami');
  //       const username = await response.json();
  //       dispatch(SET_USER(username));
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  const fetchSession = async () => {
    try {
      const response = await fetch('/users/session');
      const activeSession = await response.json();

      if (activeSession.session === false) {
        setButtons([
          <>
            <button onClick={() => navigate('/login')}>sign in</button>
            <button onClick={() => navigate('/signup')}>sign up</button>
          </>,
        ]);
        return navigate('/');
      } else if (activeSession.session === true) {
        // fetchUsername();
        setButtons([
          <>
            <button onClick={() => navigate('/dashboard')}>dashboard</button>
            <button onClick={logout}>
              {'logout @'}
              <em>
                <strong>{activeSession.username}</strong>
              </em>
            </button>
          </>,
        ]);
      }
    } catch (err) {
      return console.log(err);
    }
  };

  //empty dependency array - only triggers when header component mounts
  useEffect(() => {
    fetchSession();
  }, []);

  //   const username = useSelector((store) => store.dashboard.activeUser);

  return (
    <header>
      <div className="header-left">
        <a href="/">
          <h1>Cache App</h1>
        </a>
      </div>
      <div className="header-right">
        <button>about</button>
        <button>contact</button>
        {buttons}
      </div>
    </header>
  );
};

export default Header;
