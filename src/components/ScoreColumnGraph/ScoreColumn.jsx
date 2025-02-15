import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./ScoreColumn.css";

const data = [
  { date: "Sep 25", verbal: 520, math: 500 },
  { date: "Oct 10", verbal: 580, math: 550 },
  { date: "Oct 10", verbal: 580, math: 550 },
  { date: "Oct 10", verbal: 580, math: 550 },
  { date: "Oct 25", verbal: 620, math: 590 },
  { date: "Nov 8", verbal: 650, math: 630 },
  { date: "Nov 22", verbal: 680, math: 650 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip-container">
        <p className="tooltip-date">{label}</p>
        <p className="verbal-score">Verbal: {payload[0].value}</p>
        <p className="math-score">Math: {payload[1].value}</p>
      </div>
    );
  }
  return null;
};

export default function ScoreColumnGraph() {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
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
          />
          <YAxis
            domain={[0, 800]}
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 14 }}
            ticks={[0, 400, 800]}
            axisLine={false}
            tickSize={10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="verbal"
            fill="#4E4E4E"
            radius={[4, 4, 0, 0]}
            minBarSize={10}
            maxBarSize={30}
          />
          <Bar
            dataKey="math"
            fill="#EE4747"
            radius={[4, 4, 0, 0]}
            minBarSize={10}
            maxBarSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
