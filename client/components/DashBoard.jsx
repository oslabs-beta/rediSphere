import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LinePlot from './LinePlot.jsx';
import { SET_USER } from '../dashboardReducer.js';

const DashBoard = (props) => {
  //TO-DO:
  const { data } = props;
  const cacheHitRatio = data.cacheHitRatio;
  const timestamp = data.timestamp;

  console.log('full data obj:', data);
  console.log('cacheHit', cacheHitRatio);
  console.log('timestamp: ', timestamp);
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

  // check if there is an active session before loading dashboard
  // empty dependency array - only triggers when dashboard component mounts
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

  console.log('data in Dashboard: ', data, 'data length', data.length);
  const dataArray = Object.values(data);
  console.log('type of data prop', typeof data);
  console.log('dataArray: ', dataArray);
  console.log('dataArray length:', dataArray.length);

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
          {/* if no data yet, display loading; once state updates w/data a re-render will occur */}
          {data.length ? <LinePlot data={data}></LinePlot> : <p>Loading...</p>}
        </div>
      </div>
      <button id="add-widget-button">+</button>
    </div>
  );
};

export default DashBoard;
