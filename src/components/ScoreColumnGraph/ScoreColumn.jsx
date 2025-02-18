import React, { useState } from "react";
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
import "./ScoreColumn.css";

const data = [
  { date: "Sep 25", verbal: 520, math: 500 },
  { date: "Oct 10", verbal: 780, math: 550 },
  { date: "Oct 10", verbal: 740, math: 550 },
  { date: "Oct 25", verbal: 760, math: 590 },
  { date: "Oct 25", verbal: 700, math: 590 },
  { date: "Nov 8", verbal: 800, math: 630 },
  { date: "Nov 22", verbal: 400, math: 650 },
];

export default function ScoreColumnGraph() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Calculate the Y coordinate for the label based on the hovered value
  const getLabelYCoordinate = (value) => {
    const minValue = 0;
    const maxValue = 800;
    const totalHeight = 290;
    let result =
      ((maxValue - value) / (maxValue - minValue)) * totalHeight + 10;
    if (result === 10) {
      return 15;
    }
    // console.log(`Value: ${value}, Position: ${result}px`);
    return result;
  };

  return (
    <div className="charts-container">
      <ResponsiveContainer width="100%" height={350}>
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
            background={{ fill: "#eee" }}
            name="verbal"
            dataKey="verbal"
            fill="#456BC4"
            radius={[4, 4, 0, 0]}
            minBarSize={10}
            maxBarSize={30}
            isAnimationActive={false}
            onMouseEnter={(data) => {
              setHoveredValue(data.verbal);
              setHoveredBar("verbal");
            }}
            onMouseLeave={() => {
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
            name="math"
            background={{ fill: "#eee" }}
            dataKey="math"
            fill="#4E4E4E"
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
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
