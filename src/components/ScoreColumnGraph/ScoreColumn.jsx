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
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF33" />
          <XAxis dataKey="date" stroke="#FFFFFF" tick={{ fontSize: 14 }} />
          <YAxis
            domain={[400, 1600]}
            stroke="#FFFFFF"
            tick={{ fontSize: 14 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: "#FFFFFF", textAlign: "center" }} />
          <Bar
            dataKey="verbal"
            stackId="a"
            fill={hoveredBar ? "#D72638" : "#326BBB"}
            barSize={50}
            className="bar-verbal"
            onMouseOver={() => setHoveredBar(true)}
            onMouseOut={() => setHoveredBar(null)}
          />
          <Bar
            dataKey="math"
            stackId="a"
            fill={hoveredBar ? "#4E4E50" : "#326BBB"}
            barSize={50}
            className="bar-math"
            onMouseOver={() => setHoveredBar(true)}
            onMouseOut={() => setHoveredBar(null)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
