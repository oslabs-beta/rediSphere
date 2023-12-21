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
  const [data, setData] = useState([]);

  // //get evicted/expired keys
  // const fetchData = async () => {
  //   try {
  //     const res = await fetch('/api/evictedExpired');
  //     const newData = await res.json();
  //     return newData;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // //everytime data is updated, set timeout is called again
  // useEffect(() => {
  //   setTimeout(() => {
  //     fetchData().then((data) => {
  //       setData((prevData) => [...prevData, data]);
  //     });
  //   }, 1000);
  // }, [data]);

  //get cache hits ratio
  const fetchData = async () => {
    try {
      const res = await fetch('/api/evictedExpired');
      const newData = await res.json();
      setData([...data, newData]);
    } catch (error) {
      console.log(error);
    }
  };

  // every time cache hit data is updated, set timeout is called again
  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [data]);

  //take timestamp and overwrite with JS time instaed of server's native epoch time which is in microseconds
  //divide by 1000 to go from micro seconds to milli seconds
  let formattedData = data.flatMap((d) => {
    //use flatMap to skip nullish/undefined/NaN vals
    //after mapping, it "flattens" every element--> empty arrays just get removed, effectively filtering
    if (d.evicted === null || d.evicted === undefined) {
      // Filter out data point if null, or undefined
      console.log('datapoint filtered (evicted): ', d);
      return [];
    }
    if (d.expired === null || d.expired === undefined) {
      console.log('datapoint filtered (expired)', d);
      return [];
    }
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

  //set the top of the y-axis to the max of
  //either evicted or expired total, or to just 1 if both counts are 0
  const yMax =
    Math.max(
      d3.max(formattedData, (d) => d.expired),
      d3.max(formattedData, (d) => d.evicted),
    ) * 1.25; //and scale to 1.25 so that the max val isn't the top of the y-axis

  const y = d3
    .scaleLinear()
    .domain([0, yMax || 1])
    .range([height - marginBottom, marginTop]);

  const expiredData = formattedData.map((d) => ({
    timestamp: d.timestamp,
    val: d.expired,
  }));

  const evictedData = formattedData.map((d) => ({
    timestamp: d.timestamp,
    val: d.evicted,
  }));

  const line = d3
    .line()
    .x((d) => x(d.timestamp))
    .y((d) => y(d.val));

  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);

  if (data.length) {
    // console.log(formattedData);
    // const breakDownData = (key) => {
    //   const array = [];
    //   formattedData.forEach((el) => {
    //     const obj = {};
    //     obj.val = el[key];
    //     obj.timestamp = el.timestamp;
    //     array.push(obj);
    //   });
    //   return array;
    // };
    //something weird going on with evicted Line console errors,
    //commented path out below
    // const evictedLine = breakDownData('evicted');
    // const expiredLine = breakDownData('expired');

    // console.log('evicted', evictedLine);
    // console.log('expired', expiredLine);

    return (
      <svg width={width} height={height}>
        <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
        <text
          className="chart-label"
          transform={`translate(-15,${(height - marginBottom) / 2 + 75}) rotate(-90)`}
        >
          {'No. Eviction/Expiration'}
        </text>
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
        <text
          className="chart-label"
          transform={`translate(${(width - marginRight) / 2 - 20}, ${height - marginBottom + 35})`}
        >
          {'UTC Time'}
        </text>
        <circle
          cx={(width - marginRight) * 0.75}
          cy={height - marginBottom - 70}
          r="5"
          style={{ fill: 'blue' }}
        />
        <text
          className="legend-label"
          transform={`translate(${(width - marginRight) * 0.75 + 10}, ${
            height - marginBottom - 65
          })`}
        >
          {'no. expired'}
        </text>
        <circle
          cx={(width - marginRight) * 0.75}
          cy={height - marginBottom - 50}
          r="5"
          style={{ fill: 'red' }}
        />
        <text
          className="legend-label"
          transform={`translate(${(width - marginRight) * 0.75 + 10}, ${
            height - marginBottom - 45
          })`}
        >
          {'no. evicted'}
        </text>
        <path fill="none" stroke="blue" strokeWidth="1.5" d={line(expiredData)} />
        <g fill="none" stroke="blue" strokeWidth="1.5">
          {formattedData.map((d, i) => (
            <circle key={i} cx={x(d.timestamp)} cy={y(d.expired)} r=".75" />
          ))}
        </g>

        <path fill="none" stroke="red" strokeWidth="1.5" d={line(evictedData)} />
        <g fill="none" stroke="red" strokeWidth="1.5">
          {formattedData.map((d, i) => (
            <circle key={i} cx={x(d.timestamp)} cy={y(d.evicted)} r=".75" />
          ))}
        </g>
      </svg>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default LinePlot;
