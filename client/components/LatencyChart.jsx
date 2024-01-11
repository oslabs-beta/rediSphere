import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';

const Chart = ({
  width = 550,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
}) => {
  const [data, setData] = useState([]);

  //get latency
  const fetchData = async () => {
    try {
      const res = await fetch('/api/latency');
      const newData = await res.json();
      setData([...data, newData]);
    } catch (error) {
      console.log(error);
    }
  };

  //everytime data is updated, set timeout is called again
  useEffect(() => {
    setTimeout(() => {
      fetchData();
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
  const gyl = useRef();
  //create scales for x and y axes
  // Domain --> abstract index values of the data
  // Range --> visible pixel range that those indices will map to
  const x = d3
    .scaleUtc()
    .domain([Date.now() - 60 * 1000 * 2, Date.now()])
    .range([marginLeft, width - marginRight]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(formattedData, (d) => d.avgGetCacheTime) + 1])
    .range([height - marginBottom, marginTop]);
  const yLine = d3
    .scaleLinear()
    .domain(d3.extent(formattedData, (d) => d.totalGet))
    .range([height - marginBottom, marginTop]);

  const line = d3
    .line()
    .x((d) => x(d.timestamp))
    .y((d) => yLine(d.totalGet));

  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);
  useEffect(() => void d3.select(gyl.current).call(d3.axisRight(yLine)), [gyl, yLine]);

  if (data.length) {
    return (
      <svg width={width} height={height}>
        <text
          className="chart-label"
          transform={`translate(-15,${(height - marginBottom) / 2 + 100}) rotate(-90)`}
        >
<<<<<<< HEAD
          {'Avg. Response Time (µs)'}
=======
          {'Avg. Response Time (μs)'}
>>>>>>> d09b740e7e10861319b441240f0d4d7ded279297
        </text>
        <text
          className="chart-label"
          transform={`translate(${(width - marginRight) / 2 - 20}, ${height - marginBottom + 35})`}
        >
          {'UTC Time'}
        </text>
        <text
          className="chart-label"
          transform={`translate(${width},${(height - marginBottom) / 2 - 30}) rotate(90)`}
        >
          {'Total Get Requests'}
        </text>
        <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
        <g ref={gyl} transform={`translate(${width - marginRight},0)`} />
        <path fill="none" stroke="black" strokeWidth="1.5" d={line(formattedData)} />
        <g fill="none" stroke="black" strokeWidth="1.5">
          {formattedData.map((d, i) => (
            <circle key={i} cx={x(d.timestamp)} cy={yLine(d.totalGet)} r=".75" />
          ))}
        </g>
        <g>
          {formattedData.map((d, i) => (
            <rect
              fill="lightgreen"
              fillOpacity={0.5}
              key={i}
              x={x(d.timestamp)}
              y={y(d.avgGetCacheTime)}
              width={'5px'}
              height={height - marginBottom - y(d.avgGetCacheTime)}
            />
          ))}
        </g>
      </svg>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default Chart;
