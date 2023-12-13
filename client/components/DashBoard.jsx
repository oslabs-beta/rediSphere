import React, { useState } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';
import LinePlot from './LinePlot.jsx';

const DashBoard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    //setInteral takes:
    //1. Callback to execute
    //2. interval to wait between executions in ms
    const interval = setInterval(
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
    // a setInterval object will run until you actually tell it to stop.
    //in this case, we want it to stop if / when we unmount the component
    //consider how we can set it differently if needed

    //eg, we want to stay fetching data as long as the user is in the app (not just while the dashboard has mounted), probably,
    //set up the useEffect on the app component

    //TODO: set a conditional so that the useEffect only runs when we have a valid database connection to Redis active -- avoid erroring out/timeout
    // check w/Michelle re:auth and credentials to set strat for this

    return () => clearInterval(interval);
  }, []); //passing an empty dependency array here so the effect will run once on startup, and then on teardown (the return fires) stop trying to ping the backend
  //TO-DO:

  // const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  // function onMouseMove(event) {
  //   const [x, y] = d3.pointer(event);
  //   setData(data.slice(-200).concat(Math.atan2(x, y)));
  // }
  return (
    <div>
      <header>
        <div>
          <h1>Cache App</h1>
        </div>
        <div className="header-left">
          <button>about</button>
          <button>contact</button>
          <a href="/login">
            <button>logout</button>
          </a>
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
