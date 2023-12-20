import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SET_WIDGETS } from '../dashboardReducer.js';

import Header from './Header.jsx';
import Footer from './Footer.jsx';
import AddWidgetModal from './AddWidgetModal.jsx';
import nameToComponent from '../assets/AvailableGraphs.jsx';
import EvictedExpired from './EvictedExipredLinePlot.jsx';
import LatencyChart from './LatencyChart.jsx';
import MemoryChart from './MemoryChart.jsx';

const DashBoard = () => {
  const widgets = useSelector((store) => store.dashboard.widgetArray);
  const dispatch = useDispatch();

  //fetch user's widgets from user database on load
  const fetchWidgets = async () => {
    try {
      console.log('hello');
      const res = await fetch('/users/widgets');
      const widgetArray = await res.json();
      dispatch(SET_WIDGETS(widgetArray));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchWidgets();
  }, []);

  //delete a widget
  const deleteWidget = async (index) => {
    try {
      const deleted = await fetch('/users/delete-widget/' + index, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const widgetArray = await deleted.json();
      dispatch(SET_WIDGETS(widgetArray));
    } catch (error) {
      console.log(error);
    }
  };

  //map widget list (ex [['large', 'hitmiss']]) to a component
  const widgetDisplay = [];
  widgets.forEach((widget, index) => {
    widgetDisplay.push(
      <div className={`widget ${widget[0]}`} id={index} key={index}>
        <button
          onClick={() => {
            deleteWidget(index);
          }}
        >
          ✖
        </button>
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
