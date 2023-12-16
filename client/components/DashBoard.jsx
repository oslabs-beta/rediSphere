import React, { useState, useEffect } from 'react';
import HitMissLinePlot from './HitMissLinePlot.jsx';
import FreeMemory from './FreeMemory.jsx';
import Header from './Header.jsx';

const DashBoard = () => {
  // const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  // function onMouseMove(event) {
  //   const [x, y] = d3.pointer(event);
  //   setData(data.slice(-200).concat(Math.atan2(x, y)));
  // }

  return (
    <div className="home-page">
      <Header />
      <div className="widget-container">
        <div className="widget">
          <HitMissLinePlot></HitMissLinePlot>
        </div>
        <div className="widget small">
          <FreeMemory></FreeMemory>
        </div>
        <div className="widget medium"></div>
      </div>
      <button id="add-widget-button">+</button>
    </div>
  );
};

export default DashBoard;
