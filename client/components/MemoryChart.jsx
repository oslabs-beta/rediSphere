import React, { useRef, useEffect, useState } from 'react';

const GaugeChart = ({ radius = 50 }) => {
  const [data, setData] = useState({});

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
        setData(() => data);
      });
    }, 1000);
  }, [data]);

  if (!Object.keys(data).length) {
    return <p>Loading...</p>;
  } else {
    const percentageUsed = (data.usedMemory / 30) * 100;
    const percentagePeakUsed = (data.peakUsedMemory / 30) * 100;
    return (
      <svg className="memory-chart" width={radius * 2.5} height={radius * 2.2}>
        <defs>
          <clipPath id={`cut-off-bottom-${radius}`}>
            <rect
              transform={`translate(10, 10)`}
              width={radius * 2 + 20}
              height={radius + 10}
            ></rect>
          </clipPath>
        </defs>

        <circle
          cx={radius + 20}
          cy={radius + 20}
          r={radius}
          fill="none"
          stroke="#F4F4F4"
          strokeWidth={20}
          clipPath={`url(#cut-off-bottom-${radius})`}
        />
        <circle
          cx={radius + 20}
          cy={radius + 20}
          r={radius}
          fill="none"
          stroke="red"
          strokeWidth={20}
          pathLength={1}
          strokeDasharray={0.5 + percentagePeakUsed / 200}
          clipPath={`url(#cut-off-bottom-${radius})`}
        />
        <circle
          cx={radius + 20}
          cy={radius + 20}
          r={radius}
          fill="none"
          stroke="#3498db"
          strokeWidth={20}
          pathLength={1}
          strokeDasharray={0.5 + percentageUsed / 200}
          clipPath={`url(#cut-off-bottom-${radius})`}
        />

        <text
          x={radius + 20}
          y={radius * 1.5}
          textAnchor="middle"
          dy="0.3em"
          fontSize={radius / 5}
          fill="#3498db"
        >
          {`Current: ${percentageUsed.toFixed(2)}%`}
        </text>
        <text
          x={radius + 20}
          y={radius * 1.7}
          textAnchor="middle"
          dy="0.3em"
          fontSize={radius / 5}
          fill="red"
        >
          {`Peak: ${percentagePeakUsed.toFixed(2)}% \n`}
        </text>
        <text
          x={radius + 20}
          y={radius * 2}
          textAnchor="middle"
          dy="0.3em"
          fontSize={radius / 5 + 4}
          fontWeight={500}
          fill="black"
        >
          {'Memory Usage'}
        </text>
      </svg>
    );
  }
};

export default GaugeChart;
