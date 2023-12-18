import React, { useState, useEffect } from 'react';
import HitMissLinePlot from './HitMissLinePlot.jsx';
import FreeMemory from './FreeMemory.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const DashBoard = () => {
  const [chData, setCHData] = useState([]);

  //get cache hits ratio
  const fetchCHData = async () => {
    try {
      const res = await fetch('/api/cacheHitsRatio');
      const newData = await res.json();
      return newData;
    } catch (error) {
      console.log(error);
    }
  };

  // every time cache hit data is updated, set timeout is called again
  useEffect(() => {
    setTimeout(() => {
      fetchCHData().then((data) => {
        setCHData((prevData) => [...prevData, data]);
      });
    }, 1000);
  }, [chData]);

  // get widget data from saved database later on
  const widgets = [
    ['large', 'hitmiss'],
    ['small', 'memory'],
    ['medium', 'hitmiss'],
    ['medium', 'memory'],
    ['large', 'hitmiss'],
    ['small', 'hitmiss'],
    ['small', 'hitmiss'],
    ['large', 'memory'],
  ];

  const nameToComponent = {
    hitmiss: {
      large: <HitMissLinePlot data={chData} />,
      medium: <HitMissLinePlot data={chData} width={250} height={250} />,
      small: <HitMissLinePlot data={chData} width={100} height={100} />,
    },
    memory: {
      large: <FreeMemory></FreeMemory>,
      medium: <FreeMemory></FreeMemory>,
      small: <FreeMemory></FreeMemory>,
    },
  };

  const widgetDisplay = [];
  widgets.forEach((widget, index) => {
    widgetDisplay.push(
      <div className={`widget ${widget[0]}`} id={index} key={index}>
        {nameToComponent[widget[1]][widget[0]]}
      </div>,
    );
  });

  return (
    <div className="home-page">
      <Header />
      <div className="widget-container">
        {/* <div className="widget large" id="1">
          {<HitMissLinePlot data={data}></HitMissLinePlot>}
        </div>
        <div className="widget small" id="2">
          <FreeMemory></FreeMemory>
        </div>
        <div className="widget medium" id="3"></div>
        <div className="widget medium" id="4"></div> */}
        {widgetDisplay}
      </div>

      <button id="add-widget-button">+</button>
      <Footer />
    </div>
  );
};

export default DashBoard;
