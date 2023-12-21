import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

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
        return navigate('/');
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
