import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LinePlot from './LinePlot.jsx';
import { SET_USER } from '../dashboardReducer.js';

const DashBoard = (data) => {
  //passing an empty dependency array here so the effect will run once on startup, and then on teardown (the return fires) stop trying to ping the backend
  //TO-DO:

  // const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  // function onMouseMove(event) {
  //   const [x, y] = d3.pointer(event);
  //   setData(data.slice(-200).concat(Math.atan2(x, y)));
  // }

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

  //check if there is an active session before loading dashboard
  //empty dependency array - only triggers when dashboard component mounts
  const fetchSession = async () => {
    try {
      const response = await fetch('/users/session');
      const activeSession = await response.json();
      if (activeSession === false) return navigate('/');
    } catch (err) {
      return console.log(err);
    }
  };
  useEffect(() => {
    fetchSession();
  }, []);

  //fetch username based on ssid cookie and dispatch to store in state
  //empty dependency array - only triggers when dashboard component mounts
  const dispatch = useDispatch();
  const fetchUsername = async () => {
    try {
      const response = await fetch('/users/whoami');
      const username = await response.json();
      dispatch(SET_USER(username));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUsername();
  }, []);
  const username = useSelector((store) => store.dashboard.activeUser);

  return (
    <div>
      <header>
        <div>
          <h1>Cache App</h1>
        </div>
        <div className="header-left">
          <button>about</button>
          <button>contact</button>
          <button onClick={logout}>
            {'logout @'}
            <em>
              <strong>{username}</strong>
            </em>
          </button>
        </div>
      </header>
      <div className="widget-container">
        <div className="widget">
          <LinePlot data={data ?? [1, 2, 3, 4, 5]}></LinePlot>
        </div>
      </div>
      <button id="add-widget-button">+</button>
    </div>
  );
};

export default DashBoard;
