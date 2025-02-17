import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import "./ScoreColumn.css";

const data = [
  { date: "Sep 25", verbal: 520, math: 500 },
  { date: "Oct 10", verbal: 580, math: 550 },
  { date: "Oct 25", verbal: 620, math: 590 },
  { date: "Nov 8", verbal: 650, math: 630 },
  { date: "Nov 22", verbal: 680, math: 650 },
];

export default function ScoreColumnGraph() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length < 2) return null;

    return (
      <div className="tooltip-container">
        <p className="tooltip-date">{payload[0].payload.date}</p>
        <p className="verbal-score">Verbal: {payload[0].value}</p>
        <p className="math-score">Math: {payload[1].value}</p>
      </div>
    );
  };

  return (
    <div className="chart-container">
      <style>
        {`
          .score-label {
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
          }
          .recharts-bar-rectangle:hover + .label-group .score-label {
            opacity: 1;
          }
        `}
      </style>
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
            dy={20}
          />
          <YAxis
            domain={[0, 800]}
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 14 }}
            ticks={[0, 400, 800]}
            axisLine={false}
            tickSize={10}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={false}
            offset={0}
            allowEscapeViewBox={{ y: true }}
            wrapperStyle={{ visibility: "visible" }}
            separator=""
            shared={false}
          />
          <Bar
            name="verbal"
            dataKey="verbal"
            fill="#4E4E4E"
            radius={[4, 4, 0, 0]}
            minBarSize={10}
            maxBarSize={30}
            isAnimationActive={false}
            onMouseEnter={(data, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {data.map((entry, index) => (
              <Label
                key={`verbal-${index}`}
                value={hoveredIndex === index ? entry.verbal : ""}
                position="top"
                fill="red"
                fontSize={12}
                fontWeight="bold"
              />
            ))}
          </Bar>
          <Bar
            name="math"
            dataKey="math"
            fill="#EE4747"
            radius={[4, 4, 0, 0]}
            minBarSize={10}
            maxBarSize={30}
            isAnimationActive={false}
            onMouseEnter={(data, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {data.map((entry, index) => (
              <Label
                key={`math-${index}`}
                value={hoveredIndex === index ? entry.math : ""}
                position="top"
                fill="red"
                fontSize={12}
                fontWeight="bold"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
