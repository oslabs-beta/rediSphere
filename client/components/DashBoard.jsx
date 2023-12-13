import React, { useState } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';
import LinePlot from './LinePlot.jsx';

const DashBoard = () => {
  //passing an empty dependency array here so the effect will run once on startup, and then on teardown (the return fires) stop trying to ping the backend
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
