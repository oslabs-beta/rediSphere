import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';

const PieChart = ({
  width = 550,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
}) => {
  const [data, setData] = useState([]);

  //get evicted/expired keys
  const fetchData = async () => {
    try {
      const res = await fetch('/api/memory');
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
  //take timestamp and overwrite with JS time instaed of server's native epoch time which is in microseconds
  //divide by 1000 to go from micro seconds to milli seconds
  let formattedData = data.map((d) => {
    return {
      ...d,
      timestamp: new Date(d.timestamp / 1000),
    };
  });

  //setting to 2 minutes
  const dataTimeRange = 2;

  formattedData = formattedData.filter((d) => {
    return d.timestamp > Date.now() - 60 * 1000 * dataTimeRange;
  });

  const gx = useRef();
  const gy = useRef();

  //create scales for x and y axes
  // Domain --> abstract index values of the data
  // Range --> visible pixel range that those indices will map to
  const x = d3
    .scaleUtc()
    .domain([Date.now() - 60 * 1000 * dataTimeRange, Date.now()])
    .range([marginLeft, width - marginRight]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(formattedData, (d) => d.totalKeys)])
    .range([height - marginBottom, marginTop]);

  //   const line = d3
  //     .line()
  //     .x((d) => x(d.timestamp))
  //     .y((d) => y(d.expired));

  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);

  if (data.length) {
    return (
      <svg width={width} height={height}>
        <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
        {/* <path fill="none" stroke="blue" strokeWidth="1.5" d={line(formattedData)} />
        <g fill="none" stroke="blue" strokeWidth="1.5">
          {formattedData.map((d, i) => (
            <circle key={i} cx={x(d.timestamp)} cy={y(d.expired)} r=".75" />
          ))}
        </g>
        <path fill="none" stroke="red" strokeWidth="1.5" d={line(formattedData)} />
        <g fill="none" stroke="red" strokeWidth="1.5">
          {formattedData.map((d, i) => (
            <circle key={i} cx={x(d.timestamp)} cy={y(d.evicted)} r=".75" />
          ))}
        </g> */}
      </svg>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default PieChart;
