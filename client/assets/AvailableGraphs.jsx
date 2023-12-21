import React from 'react';
import HitMissLinePlot from '../components/HitMissLinePlot.jsx';
// import FreeMemory from '../components/FreeMemory.jsx';
import EvictedExpired from '../components/EvictedExpiredLinePlot.jsx';
import LatencyChart from '../components/LatencyChart.jsx';
import MemoryChart from '../components/MemoryChart.jsx';

const nameToComponent = {
  hitmiss: {
    large: <HitMissLinePlot />,
    medium: <HitMissLinePlot width={250} height={250} />,
  },
  memory: {
    large: <MemoryChart radius={150}></MemoryChart>,
    medium: <MemoryChart radius={100}></MemoryChart>,
    small: <MemoryChart radius={50}></MemoryChart>,
  },
  evictedExpired: {
    large: <EvictedExpired></EvictedExpired>,
    medium: <EvictedExpired width={250} height={250}></EvictedExpired>,
  },
  latency: {
    large: <LatencyChart></LatencyChart>,
    medium: <LatencyChart width={250} height={250}></LatencyChart>,
  },
};

export default nameToComponent;
