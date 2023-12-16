import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

const LinePlot = ({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 40,
}) => {
  //gx --> declared as useRef, allows us to reference / change the <g> tag in the code below
  // <g> is a group of elements; can be used for transforms (rotate, translate)
  //in this case, it's referencing groups to represent x-axis and y-axis positions

  //console.log(data);
  const gx = useRef();
  const gy = useRef();

  //take timestamp and overwrite with JS time instaed of server's native epoch time which is in microseconds
  //divide by 1000 to go from micro seconds to milli seconds
  let formattedData = data.map((d) => {
    return {
      ...d,
      timestamp: new Date(d.timestamp / 1000),
    };
  });

  //can pass prop down from dashboard (say, a time range selector, eg, last 5 minutes, last 10 minutes, last week, month, etc)
  //defaulting to 2 minutes
  const dataTimeRange = /* props.dataTimeRange || */ 2;

  formattedData = formattedData.filter((d) => {
    return d.timestamp > Date.now() - 60 * 1000 * dataTimeRange;
  });
  //console.log('formattedData ', formattedData);

  //create scales for x and y axes
  //args are :
  // 1. Domain --> abstract index values of the data (here, equal to the number of data points passed in)
  // 2. Range --> visible pixel range that those indices will map to (here, equal to the left margin over to the right margin)
  const x = d3
    .scaleUtc()
    //set the domain from now to 5 minutes from now
    .domain([Date.now() - 60 * 1000 * dataTimeRange, Date.now()])
    //.domain(d3.extent(formattedData, (d) => d.timestamp))
    .range([marginLeft, width - marginRight]);

  //same thing
  //1. Domain --> minimum to maximum of actual data values passed in.
  //2. Range --> visible pixel range that those values will map to (here, equal to the pixels between bottom and top margins)
  const y = d3.scaleLinear(/* d3.extent(data) */ [0, 1], [height - marginBottom, marginTop]);

  //create a new line object in d3; d and i represent datapoint and index
  //in this case, we're mapping the index onto the x axis with an arrow function
  // and the data (not yet passed in) will auto-map to y too.
  // note: I *think* you can implicitly invoke x and y, eg, just do line(x, y)
  // full line function is line(<xScale>, <yScale>, [data as array] = null)

  const line = d3
    .line()
    .x((d) => x(d.timestamp))
    .y((d) => y(d.cacheHitRatio));

  //temp component to add time as a tooltip on the circles
  function Tooltip({ time }) {
    // Convert UTC time to local browser time
    const localeTime = new Date(time).toLocaleString();
    console.log('localeTime', localeTime);

    return (
      <div
        className="tooltip"
        style={{
          width: '100px',
          height: '20px',
          position: 'absolute',
          left: 100,
          top: 0,
          zIndex: 10,
        }}
      >
        <span>{localeTime}</span>
      </div>
    );
  }

  //1. select the x group (gx)
  //2. call the "axisBottom"/"axisLeft" axis generator methods, pass in the const x and const y scales from above as the scales--axis generators take a scale as an arg
  //3. d3.call() renders the element in the selected parent component on the page --> so in this case, select the "gx" axis group element, and render the axes to them
  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);

  //note that the gx and gy refs below
  //are using transforms to make sure that the axes are offset from the edges of the component
  //by the specified margins from the props in the constructor

  //here, we actually render a line in the path component
  //path component has the d attribute, which takes in a string to output a path.
  //d3's line function outputs a string formatted correctly to work with the d attribute
  //it acutally looks something like 'M10 50 L30 20 L50 60 L70 30'
  //which means 1. Move to (10,50); draw line to (30,20); draw line to (50,60) #tmyk
  // <Tooltip key={i} time={d.timestamp}>
  // </Tooltip>
  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(formattedData)} />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {formattedData.map((d, i) => (
          <circle key={i} cx={x(d.timestamp)} cy={y(d.cacheHitRatio)} r="1.5" />
        ))}
      </g>
    </svg>
  );
};

export default LinePlot;
