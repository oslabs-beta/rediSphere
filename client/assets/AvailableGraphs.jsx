import React from 'react';
import HitMissLinePlot from '../components/HitMissLinePlot.jsx';
import FreeMemory from '../components/FreeMemory.jsx';

const nameToComponent = {
  hitmiss: {
    large: <HitMissLinePlot />,
    medium: <HitMissLinePlot width={250} height={250} />,
  },
  memory: {
    large: <FreeMemory></FreeMemory>,
    medium: <FreeMemory></FreeMemory>,
    small: <FreeMemory></FreeMemory>,
  },
};

export default nameToComponent;
