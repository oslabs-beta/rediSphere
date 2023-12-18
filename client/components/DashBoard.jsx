import React, { useState, useEffect } from 'react';
import HitMissLinePlot from './HitMissLinePlot.jsx';
import FreeMemory from './FreeMemory.jsx';
import Header from './Header.jsx';

const DashBoard = () => {
  const [data, setData] = useState([]);

  //get cache hits ratio
  const fetchData = async () => {
    try {
      const res = await fetch('/api/cacheHitsRatio');
      const newData = await res.json();
      return newData;
    } catch (error) {
      console.log(error);
    }
  };

  //everytime data is updated, set timeout is called again
  useEffect(() => {
    setTimeout(() => {
      fetchData().then((data) => {
        setData((prevData) => [...prevData, data]);
      });
    }, 1000);
  }, [data]);

  return (
    <div className="home-page">
      <Header />
      <div className="widget-container">
        <div className="widget">{<HitMissLinePlot data={data}></HitMissLinePlot>}</div>
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
