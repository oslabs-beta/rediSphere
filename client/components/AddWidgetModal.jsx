import React from 'react';
import { useDispatch } from 'react-redux';
import { SET_WIDGETS } from '../dashboardReducer.js';

import nameToComponent from '../assets/AvailableGraphs.jsx';

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
          {`${size} ${chart}`}
        </button>,
      );
    }
  }

  return (
    <div>
      <div className="overlay" id="overlay"></div>
      <div className="modal" id="add-widget">
        <button className="exit-button">X</button>
        <p>
          <strong>{'Add a widget:'}</strong>
        </p>
        <div>{buttonList}</div>
      </div>
    </div>
  );
};

export default Modal;
