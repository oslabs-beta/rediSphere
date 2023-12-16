import * as d3 from 'd3';
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './styles.css';

import HomePage from './components/HomePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';
import DashBoard from './components/DashBoard.jsx';
import ConnectRedisPage from './components/ConnectRedis.jsx';
import fetchData from './utils/fetchData.js';
let hasRan = false;

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const ping = !hasRan
      ? setInterval(() => {
          //check for global has ran (extra sure this only runs once, even in dev mode)
          hasRan = true; //flip hasRan to true --> won't run again
          fetchData().then((data) => {
            console.log('data inside useEffect', data);
            setData((prevData) => [...prevData, data]); //run setData, appending the fetchedData from the util method
          });
        }, 1000)
      : null; //defaults to null if hasRan is already true

    return () => {
      // should run when the app first loads, which will start the ping. setInterval executes repeatedly, automatically, runs until we clear the interval object
      //return doesn't happen until the App component unmounts, eg, user closes app
      //hasRan = false;
      if (ping) clearInterval(ping);
      console.log('ended ping');
    };
    //TODO: set a conditional so that the useEffect only runs when we have a valid database connection to Redis active -- avoid erroring out/timeout
  }, []); //passing empty dependency array --> don't reinitiate setInterval multiple times

  console.log('data passed as prop from app: ', data);
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/connectredis" element={<ConnectRedisPage />} />
      <Route path="/dashboard" element={<DashBoard data={data} />} />
    </Routes>
  );
};
export default App;
