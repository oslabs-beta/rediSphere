import React, { useState } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';
import LinePlot from './LinePlot.jsx';

const DashBoard = () => {
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  function onMouseMove(event) {
    const [x, y] = d3.pointer(event);
    setData(data.slice(-200).concat(Math.atan2(x, y)));
  }
  return (
    <div onMouseMove={onMouseMove}>
      <LinePlot data={data}></LinePlot>
    </div>
  );
};

export default DashBoard;
