import * as d3 from 'd3';
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './styles.css';

import HomePage from './components/HomePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';
import DashBoard from './components/DashBoard.jsx';
import ConnectRedisPage from './components/ConnectRedis.jsx';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    //setInteral takes:
    //1. Callback to execute
    //2. interval to wait between executions in ms

    let isMounted = true;

    const fetchData = async () => {
      try {
        //call to backend
        const res = await fetch('/api/cacheHitsRatio');
        //grab data from response
        const newData = await res.json();
        if (isMounted) {
          //add new datapoint to state
          setData((prevData) => [...prevData, newData]);
        }
      } catch (error) {
        console.log(error);
        if (isMounted) {
          setError(error);
        }
      }
    };
    const ping = setInterval(fetchData, 1000);
    return () => {
      // should run when the app first loads, which will start the ping. setInterval executes repeatedly, automatically, runs until we clear the interval object
      //return doesn't happen until the App component unmounts, eg, user closes app
      isMounted = false;
      clearInterval(ping);
    };

    //TODO: set a conditional so that the useEffect only runs when we have a valid database connection to Redis active -- avoid erroring out/timeout
    // check w/Michelle re:auth and credentials to set strat for this

    //return () => clearInterval(ping);
  }, []); //passing empty dependency array --> don't reinitiate setInterval multiple times

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/connectredis" element={<ConnectRedisPage />} />
      <Route path="/dashboard" element={<DashBoard />} />
    </Routes>
  );
};
export default App;
