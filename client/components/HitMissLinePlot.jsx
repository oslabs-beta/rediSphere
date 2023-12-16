import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';

const LinePlot = ({
  width = 550,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
}) => {
  const [data, setData] = useState([0]);

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

  const gx = useRef();
  const gy = useRef();
  const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
  const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
  const line = d3.line((d, i) => x(i), y);
  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);
  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path fill="none" stroke="blue" strokeWidth="1.5" d={line(data)} />
      <g fill="none" stroke="blue" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r=".75" />
        ))}
      </g>
      <path fill="none" stroke="red" strokeWidth="1.5" d={line(data.map((d) => 1 - d))} />
      <g fill="none" stroke="red" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(1 - d)} r=".75" />
        ))}
      </g>
    </svg>
  );
};

export default LinePlot;
