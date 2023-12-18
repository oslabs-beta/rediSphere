import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';

const LinePlot = ({
  data,
  width = 550,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
}) => {
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
  const y = d3.scaleLinear([0, 1], [height - marginBottom, marginTop]);

  const line = d3
    .line()
    .x((d) => x(d.timestamp))
    .y((d) => y(d.cacheHitRatio));

  // //temp component to add time as a tooltip on the circles
  // function Tooltip({ time }) {
  //   // Convert UTC time to local browser time
  //   const localeTime = new Date(time).toLocaleString();
  //   console.log('localeTime', localeTime);

  //   return (
  //     <div
  //       className="tooltip"
  //       style={{
  //         width: '100px',
  //         height: '20px',
  //         position: 'absolute',
  //         left: 100,
  //         top: 0,
  //         zIndex: 10,
  //       }}
  //     >
  //       <span>{localeTime}</span>
  //     </div>
  //   );
  // }

  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);

  if (data.length) {
    //invert cachHitRatio for red miss ratio line
    const getMissRatio = () => {
      let missArray = [];
      formattedData.forEach((el) => {
        const newEl = { ...el };
        newEl.cacheHitRatio = 1 - el.cacheHitRatio;
        missArray.push(newEl);
      });
      return missArray;
    };
    const misses = getMissRatio();

    return (
      <svg width={width} height={height}>
        <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
        <path fill="none" stroke="blue" strokeWidth="1.5" d={line(formattedData)} />
        <g fill="none" stroke="blue" strokeWidth="1.5">
          {formattedData.map((d, i) => (
            <circle key={i} cx={x(d.timestamp)} cy={y(d.cacheHitRatio)} r=".75" />
          ))}
        </g>
        <path fill="none" stroke="orange" strokeWidth="1.5" d={line(misses)} />
        <g fill="none" stroke="orange" strokeWidth="1.5">
          {misses.map((d, i) => (
            <circle key={i} cx={x(d.timestamp)} cy={y(d.cacheHitRatio)} r=".75" />
          ))}
        </g>
      </svg>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default LinePlot;
