import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LinePlot from './LinePlot.jsx';
import { SET_USER } from '../dashboardReducer.js';

const DashBoard = () => {
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  function onMouseMove(event) {
    const [x, y] = d3.pointer(event);
    setData(data.slice(-200).concat(Math.atan2(x, y)));
  }

  const navigate = useNavigate();
  const logout = async () => {
    const response = await fetch('/users/signout', {
      method: 'DELETE',
    });
    const result = await response.json();
    if (result === true) return navigate('/');
    return;
  };

  const dispatch = useDispatch();

  const fetchUsername = () => {
    fetch('/users/whoami')
      .then((res) => res.json())
      .then((username) => dispatch(SET_USER(username)))
      .catch((err) => console.log('could not get username'));
  };
  useEffect(() => {
    fetchUsername();
  });
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
        <div className="widget" onMouseMove={onMouseMove}>
          <LinePlot data={data}></LinePlot>
        </div>
        <div className="widget" onMouseMove={onMouseMove}>
          <LinePlot data={data}></LinePlot>
        </div>
        <div className="widget" onMouseMove={onMouseMove}>
          <LinePlot data={data}></LinePlot>
        </div>
        <div className="widget" onMouseMove={onMouseMove}>
          <LinePlot data={data}></LinePlot>
        </div>
      </div>
      <button id="add-widget-button">+</button>
    </div>
  );
};

export default DashBoard;
