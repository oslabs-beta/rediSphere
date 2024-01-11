import React from 'react';
import { useDispatch } from 'react-redux';
import { SET_WIDGETS } from '../dashboardReducer.js';

import nameToComponent from '../assets/AvailableGraphs.jsx';

import largeCacheIcon from '../assets/large-cache-hit.png';
import medCacheIcon from '../assets/med-cache-hit.png';
import largeLatencyIcon from '../assets/large-latency.png';
import medLatencyIcon from '../assets/med-latency.png';
import largeEvExIcon from '../assets/large-evex.png';
import medEvExIcon from '../assets/med-evex.png';
import memoryIcon from '../assets/memory-usage.png';

const buttonIcons = {
  'large hitmiss': largeCacheIcon,
  'medium hitmiss': medCacheIcon,
  'large memory': memoryIcon,
  'medium memory': memoryIcon,
  'small memory': memoryIcon,
  'large evictedExpired': largeEvExIcon,
  'medium evictedExpired': medEvExIcon,
  'large latency': largeLatencyIcon,
  'medium latency': medLatencyIcon,
};

const nameMap = {
  hitmiss: 'Cache Hit/Miss Ratio',
  memory: 'Memory Usage',
  evictedExpired: 'Evicted/Expired',
  latency: 'Av. Response Time',
};

const Modal = () => {
  const dispatch = useDispatch();

  //map widget list to buttons
  const buttonList = [];
  for (const chart in nameToComponent) {
    for (const size in nameToComponent[chart]) {
      buttonList.push(
        <button
          onClick={async () => {
            document.getElementById('overlay').classList.remove('active');
            document.getElementById('add-widget').classList.remove('active');
            const added = await fetch('/users/add-widget', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ newWidget: [`${size}`, `${chart}`] }),
            });
            const updatedWidgetsArray = await added.json();
            dispatch(SET_WIDGETS(updatedWidgetsArray));
          }}
          key={`${size} ${chart}`}
        >
          <img className={`${size}`} src={`${buttonIcons[`${size} ${chart}`]}`}></img>
          <br></br>
          {`${nameMap[`${chart}`]}`}
        </button>,
      );
    }
  }

  return (
    <div>
      <div className="overlay" id="overlay"></div>
      <div className="modal" id="add-widget">
        <button
          id="x-button"
          onClick={() => {
            document.getElementById('overlay').classList.remove('active');
            document.getElementById('add-widget').classList.remove('active');
          }}
        >
          ✖
        </button>
        <h2>
          <strong>{'Add a widget:'}</strong>
        </h2>
        <div className="widget-button-container">{buttonList}</div>
      </div>
    </div>
  );
};

export default Modal;
