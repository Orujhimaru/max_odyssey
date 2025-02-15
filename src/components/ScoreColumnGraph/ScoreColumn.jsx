import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import "./ScoreColumn.css"; // Import the CSS file

const data = [
  { date: "June 12", verbal: 650, math: 540 },
  { date: "July 5", verbal: 620, math: 560 },
  { date: "Aug 20", verbal: 670, math: 650 },
  { date: "Sep 4", verbal: 700, math: 690 },
  { date: "Oct 15", verbal: 720, math: 700 },
  { date: "Nov 8", verbal: 750, math: 750 },
  { date: "Dec 22", verbal: 730, math: 720 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip-container">
        <p className="tooltip-title">{payload[0].payload.date}</p>
        <p className="verbal-score">Verbal: {payload[0].payload.verbal}</p>
        <p className="math-score">Math: {payload[0].payload.math}</p>
        <p>Total: {payload[0].payload.verbal + payload[0].payload.math}</p>
      </div>
    );
  }
  return null;
};

export default function ScoreColumnGraph() {
  const [hoveredBar, setHoveredBar] = useState(null);

  return (
    <div className="chart-container">
      <h2 className="chart-title">Mock Exam Scores</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          maxBarSize={50}
        >
          <defs>
            <linearGradient
              id="barGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF33" />
          <XAxis
            dataKey="date"
            stroke="#FFFFFF"
            tick={{ fontSize: 14 }}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            domain={[400, 1600]}
            stroke="#FFFFFF"
            tick={{ fontSize: 14 }}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* <Legend wrapperStyle={{ color: "#FFFFFF", textAlign: "center" }} /> */}
          <Bar
            dataKey="verbal"
            stackId="a"
            fill="url(#barGradient)"
            minPointSize={2}
            className="bar-verbal"
            radius={[0, 0, 4, 4]}
            onMouseOver={(data, index) =>
              setHoveredBar({ type: "verbal", index })
            }
            onMouseOut={() => setHoveredBar(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`verbal-${index}`}
                fill={
                  hoveredBar?.type === "verbal" && hoveredBar?.index === index
                    ? "#FFA726"
                    : "url(#barGradient)"
                }
              />
            ))}
          </Bar>
          <Bar
            dataKey="math"
            stackId="a"
            fill="url(#barGradient)"
            barSize={50}
            className="bar-math"
            radius={[4, 4, 0, 0]}
            onMouseOver={(data, index) =>
              setHoveredBar({ type: "math", index })
            }
            onMouseOut={() => setHoveredBar(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`math-${index}`}
                fill={
                  hoveredBar?.type === "math" && hoveredBar?.index === index
                    ? "#E53935"
                    : "url(#barGradient)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
