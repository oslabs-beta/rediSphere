import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SET_WIDGETS } from '../dashboardReducer.js';

const Modal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div>
      <div className="overlay" id="overlay"></div>
      <div className="modal" id="add-widget">
        <p>
          <strong>{'Add a widget:'}</strong>
        </p>
        <div>
          <button
            onClick={async () => {
              document.getElementById('overlay').classList.remove('active');
              document.getElementById('add-widget').classList.remove('active');
              const added = await fetch('/users/add-widget', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newWidget: ['large', 'hitmiss'] }),
              });
              const updatedWidgetsArray = await added.json();
              //   console.log('updatedWidgetsArray: ', updatedWidgetsArray);
              dispatch(SET_WIDGETS(updatedWidgetsArray));
            }}
          >
            {'large hit miss graph'}
          </button>
          <button>{'another button'}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
