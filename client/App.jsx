import * as d3 from 'd3';
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './styles.css';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';
import DashBoard from './components/DashBoard.jsx';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    //setInteral takes:
    //1. Callback to execute
    //2. interval to wait between executions in ms
    const ping = setInterval(
      () => {
        //call to backend
        fetch('/api')
          //grab data from response
          .then((res) => {
            res.json();
            //add'l parsing??
          })
          .then((newPoint) => {
            //add new datapoint to state
            setData((prevData) => [...prevData, newPoint]);
          });
      },
      1000, //frequency in milliseconds
    );

    //TODO: set a conditional so that the useEffect only runs when we have a valid database connection to Redis active -- avoid erroring out/timeout
    // check w/Michelle re:auth and credentials to set strat for this

    // should run when the app first loads, which will start the ping. setInterval executes repeatedly, automatically, runs until we clear the interval object
    //return doesn't happen until the App component unmounts, eg, user closes app
    return () => clearInterval(ping);
  }, []); //passing empty dependency array --> don't reinitiate setInterval multiple times

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashBoard />} />
    </Routes>
  );
};
export default App;
