import { useEffect, useRef } from "react";
import {
  axisBottom,
  axisLeft,
  scaleBand,
  scaleLinear,
  select
} from "d3";

function AxisBottom({ scale, transform }) {
  const groupRef = useRef(null);

  useEffect(() => {
    if (groupRef.current) {
      select(groupRef.current).call(axisBottom(scale));
    }
  }, [scale]);

  return <g ref={groupRef} transform={transform} />;
}

function AxisLeft({ scale }) {
  const groupRef = useRef(null);

  useEffect(() => {
    if (groupRef.current) {
      select(groupRef.current).call(axisLeft(scale));
    }
  }, [scale]);

  return <g ref={groupRef} />;
}

function Bars({ data, height, scaleX, scaleY }) {
  return (
    <>
      {data.map(({ value, label }) => (
        <rect
          key={`bar-${label}`}
          x={scaleX(label)}
          y={scaleY(value)}
          width={scaleX.bandwidth()}
          height={height - scaleY(value)}
          fill="teal"
        />
      ))}
    </>
  );
}

export function BarChart({ data }) {
  const margin = { top: 10, right: 0, bottom: 20, left: 30 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const scaleX = scaleBand()
    .domain(data.map(({ label }) => label))
    .range([0, width])
    .padding(0.5);
  const scaleY = scaleLinear()
    .domain([0, Math.max(...data.map(({ value }) => value))])
    .range([height, 0]);

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <AxisBottom scale={scaleX} transform={`translate(0, ${height})`} />
        <AxisLeft scale={scaleY} />
        <Bars data={data} height={height} scaleX={scaleX} scaleY={scaleY} />
      </g>
    </svg>
  );
}
