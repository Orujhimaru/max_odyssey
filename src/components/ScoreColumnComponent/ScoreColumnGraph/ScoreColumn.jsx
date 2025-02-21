import React, { useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Label,
  Cell,
} from "recharts";
import ScoreBox from "../ScoreBox/ScoreBox";
import "./ScoreColumn.css";

const data = [
  { date: "Sep 25", verbal: 520, math: 500 },
  { date: "Oct 10", verbal: 780, math: 550 },
  { date: "Oct 10", verbal: 740, math: 550 },
  { date: "Oct 25", verbal: 760, math: 550 },
  { date: "Oct 25", verbal: 700, math: 590 },
  { date: "Nov 8", verbal: 800, math: 630 },
  { date: "Nov 22", verbal: 400, math: 650 },
];

const calculateAverage = (data, key) => {
  const total = data.reduce((acc, curr) => acc + curr[key], 0);
  return Math.floor(total / data.length / 10) * 10;
};

const verbalAverage = calculateAverage(data, "verbal");

const mathAverage = calculateAverage(data, "math");

const verbalScoreStart = data[0].verbal;
const verbalScoreEnd = data[data.length - 1].verbal;
const verbalChange = verbalAverage - verbalScoreStart;

const mathScoreStart = data[0].math;
const mathScoreEnd = data[data.length - 1].math;
const mathChange = mathAverage - mathScoreStart;

export default function ScoreColumnGraph() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Add this ref to get chart container dimensions
  const chartRef = useRef(null);

  // Calculate the Y coordinate for the label based on the hovered value
  const getLabelYCoordinate = (value) => {
    const minValue = 0;
    const maxValue = 800;
    const totalHeight = 290;
    let result = ((maxValue - value) / (maxValue - minValue)) * totalHeight + 9;
    if (result === 10) {
      return 15;
    }

    // console.log(`Value: ${value}, Position: ${result}px`);
    return result;
  };

  // Add this function inside the component to calculate the line coordinates
  const getLineCoordinates = (value) => {
    if (!chartRef.current) return { x1: 0, y1: 0, x2: 0, y2: 0 };

    const { width } = chartRef.current.getBoundingClientRect();
    const yAxis = 90;
    const bar = { width: 30, gap: 20 };

    const y = getLabelYCoordinate(value) + 10;

    const barSpacing = (width - yAxis - 80) / data.length;
    const x =
      yAxis +
      hoveredIndex * barSpacing +
      bar.width +
      bar.gap +
      (hoveredBar === "math" ? bar.width : 0);

    return { x1: yAxis, y1: y, x2: x, y2: y };
  };

  return (
    <div className="charts-container">
      <div className="score-boxes">
        <ScoreBox
          title="Verbal"
          score={verbalAverage.toFixed(0)}
          improvement={verbalChange}
          type="verbal"
        />
        <ScoreBox
          title="Math"
          score={mathAverage.toFixed(0)}
          improvement={mathChange}
          type="math"
        />
      </div>
      <ResponsiveContainer width="100%" height={350} ref={chartRef}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          barGap={1}
          barCategoryGap="20%"
        >
          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke="#94a3b820"
            strokeWidth={0.5}
          />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", className: "x-axis-tick" }}
            axisLine={false}
            tickSize={0}
            dy={10}
          />
          <YAxis
            domain={[0, 800]}
            stroke="#94a3b8"
            tick={{
              fill: "#94a3b8",
              fontSize: 14,
              opacity: hoveredValue ? 0.2 : 1,
              transition: "opacity 0.2s ease-in-out",
            }}
            ticks={[0, 400, 800]}
            axisLine={false}
            tickSize={10}
          >
            {hoveredValue && (
              <Label
                value={hoveredValue}
                position="top"
                offset={10}
                style={{
                  transform: `translateY(${getLabelYCoordinate(
                    hoveredValue
                  )}px)`,
                  fontWeight: 500,
                }}
              />
            )}
          </YAxis>

          <Bar
            background={{ fill: "var(--bar-background)" }}
            name="verbal"
            dataKey="verbal"
            fill="var(--bar-verbal-color)"
            radius={[4, 4, 0, 0]}
            minBarSize={10}
            maxBarSize={30}
            isAnimationActive={false}
            onMouseEnter={(data, index) => {
              setHoveredIndex(index);
              setHoveredValue(data.verbal);
              setHoveredBar("verbal");
            }}
            onMouseLeave={() => {
              setHoveredIndex(null);
              setHoveredValue(null);
              setHoveredBar(null);
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`verbal-${index}`}
                style={{ transition: "opacity 0.3s ease-in-out" }}
                opacity={
                  hoveredBar === "verbal" || hoveredBar === null ? 1 : 0.2
                }
              />
            ))}
          </Bar>
          <Bar
            background={{ fill: "var(--bar-background)" }}
            name="math"
            dataKey="math"
            fill="var(--bar-math-color)"
            radius={[4, 4, 0, 0]}
            minBarSize={10}
            maxBarSize={30}
            isAnimationActive={false}
            onMouseEnter={(data, index) => {
              setHoveredIndex(index);
              setHoveredValue(data.math);
              setHoveredBar("math");
            }}
            onMouseLeave={() => {
              setHoveredIndex(null);
              setHoveredValue(null);
              setHoveredBar(null);
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`math-${index}`}
                style={{ transition: "opacity 0.3s ease-in-out" }}
                opacity={hoveredBar === "math" || hoveredBar === null ? 1 : 0.2}
              />
            ))}
          </Bar>
          {hoveredValue && (
            <line
              {...getLineCoordinates(hoveredValue)}
              stroke="var(--bar-math-line-color)"
              strokeWidth={1}
              strokeDasharray="4"
              className="score-guide-line"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
