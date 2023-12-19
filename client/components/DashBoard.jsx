import React, { useState, useEffect } from 'react';
import HitMissLinePlot from './HitMissLinePlot.jsx';
import FreeMemory from './FreeMemory.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import AddWidgetModal from './AddWidgetModal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { SET_WIDGETS } from '../dashboardReducer.js';

const DashBoard = () => {
  const [chData, setCHData] = useState([]);
  // const [widgets, setWidgets] = useState([]);
  const widgets = useSelector((store) => store.dashboard.widgetArray);
  const dispatch = useDispatch();

  //get cache hits ratio
  const fetchCHData = async () => {
    try {
      const res = await fetch('/api/cacheHitsRatio');
      const newData = await res.json();
      setCHData([...chData, newData]);
    } catch (error) {
      console.log(error);
    }
  };

  // every time cache hit data is updated, set timeout is called again
  useEffect(() => {
    setTimeout(() => {
      fetchCHData();
    }, 1000);
  }, [chData]);

  //fetch user's widgets from user database on load
  const fetchWidgets = async () => {
    try {
      console.log('hello');
      const res = await fetch('/users/widgets');
      const widgetArray = await res.json();
      dispatch(SET_WIDGETS(widgetArray));
      // setWidgets(widgetArray);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchWidgets();
  }, []);

  const nameToComponent = {
    hitmiss: {
      large: <HitMissLinePlot data={chData} />,
      medium: <HitMissLinePlot data={chData} width={250} height={250} />,
      small: <HitMissLinePlot data={chData} width={120} height={120} />,
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
      <div className="widget-container">{widgetDisplay}</div>

      <button
        id="add-widget-button"
        onClick={() => {
          document.getElementById('overlay').classList.add('active');
          document.getElementById('add-widget').classList.add('active');
        }}
      >
        +
      </button>
      <AddWidgetModal />
      <Footer />
    </div>
  );
};

export default DashBoard;
