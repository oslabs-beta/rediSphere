import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

const LinePlot = ({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
}) => {
  //gx --> declared as useRef, allows us to reference / change the <g> tag in the code below
  // <g> is a group of elements; can be used for transforms (rotate, translate)
  //in this case, it's referencing groups to represent x-axis and y-axis positions

  //console.log(data);
  const gx = useRef();
  const gy = useRef();

  //TODO:
  //TODO: modify the domain for time-series data; eg, once we have timestamps set up,
  //domain will be oldest to newest timestamps;
  //consider a declared domain instead (eg, 1 min, 5 mins, etc) as this is going to look a little weird

  //create linear scales for x and y axes
  //args are :
  // 1. Domain --> abstract index values of the data (here, equal to the number of data points passed in)
  // 2. Range --> visible pixel range that those indices will map to (here, equal to the left margin over to the right margin)
  const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);

  //same thing
  //1. Domain --> minimum to maximum of actual data values passed in.
  //2. Range --> visible pixel range that those values will map to (here, equal to the pixels between bottom and top margins)
  const y = d3.scaleLinear(/* d3.extent(data) */ [0, 1], [height - marginBottom, marginTop]);

  //create a new line object in d3; d and i represent datapoint and index
  //in this case, we're mapping the index onto the x axis with an arrow function
  // and the data (not yet passed in) will auto-map to y too.
  // note: I *think* you can implicitly invoke x and y, eg, just do line(x, y)
  // full line function is line(<xScale>, <yScale>, [data as array] = null)
  const line = d3.line((d, i) => x(i), y);

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
  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
        ))}
      </g>
    </svg>
  );
};

export default LinePlot;
