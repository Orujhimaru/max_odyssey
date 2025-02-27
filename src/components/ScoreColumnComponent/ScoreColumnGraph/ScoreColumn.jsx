import React, { useState, useRef, useEffect } from "react";
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
import PredictedScore from "../PredictedScore/PredictedScore";

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
  const [displayData, setDisplayData] = useState(data);
  const [examCount, setExamCount] = useState(7);

  // Add this ref to get chart container dimensions
  const chartRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1180) {
        // Show only last 5 entries when screen is smaller
        setDisplayData(data.slice(-5));
        setExamCount(5);
      } else {
        // Show all data when screen is larger
        setDisplayData(data);
        setExamCount(7);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate the Y coordinate for the label based on the hovered value
  const getLabelYCoordinate = (value) => {
    const minValue = 0;
    const maxValue = 800;
    const totalHeight = 290;
    let result = ((maxValue - value) / (maxValue - minValue)) * totalHeight + 9;

    if (result === 10) {
      return 15;
    }

    // Add offset for value 800
    if (value === 800) {
      result += 4; // Shift down 4px when value is 800
    }

    return result;
  };

  // Add this function inside the component to calculate the line coordinates
  const getLineCoordinates = (value) => {
    if (!chartRef.current) return { x1: 0, y1: 0, x2: 0, y2: 0 };

    const { width } = chartRef.current.getBoundingClientRect();
    const yAxis = 55;

    // Calculate dynamic bar dimensions based on container width
    const bar = {
      width: width <= 1044 ? 20 : 27, // Smaller bars on mobile
      gap: width <= 1044 ? 20 : 32, // Smaller gaps on mobile
    };

    const y = getLabelYCoordinate(value) + 10;

    // Calculate available space for bars
    const availableWidth = width - yAxis - (width <= 1044 ? 40 : 30); // Dynamic right margin
    const totalBars = displayData.length;

    // Calculate spacing between bar groups
    const barSpacing = availableWidth / totalBars;
    const barGroupCenter = barSpacing / 2;

    // Add extra offset for last two indices
    const extraOffset = hoveredIndex >= totalBars - 2 ? 10 : 0;

    // Calculate x position with adjusted offset
    const x =
      yAxis +
      hoveredIndex * barSpacing +
      barGroupCenter + // Center in the bar group
      (hoveredBar === "math" ? bar.width + bar.gap / 2 : 0) + // Adjust offset for math bars
      extraOffset; // Add extra space for last bars

    return {
      x1: yAxis,
      y1: y,
      x2: x,
      y2: y,
    };
  };

  // Calculate average scores
  const averageVerbal = Math.round(
    data.reduce((acc, item) => acc + item.verbal, 0) / data.length
  );
  const averageMath = Math.round(
    data.reduce((acc, item) => acc + item.math, 0) / data.length
  );

  return (
    <>
      <h2 className="scores-header-text ">Score report</h2>
      <div className="score-column-container">
        <div className="chart-container">
          <PredictedScore verbalScore={averageVerbal} mathScore={averageMath} />

          <div className="chart-bar-section">
            <div className="chart-header">
              <h3 className="chart-title">Last {examCount} Mock Exams</h3>
            </div>
            <ResponsiveContainer width="100%" height={350} ref={chartRef}>
              <BarChart
                data={displayData}
                margin={{
                  top: 20,
                  right: 10,
                  left: 20,
                  bottom: 20,
                }}
                barGap={1}
                barCategoryGap="10%"
                barSize={27}
                layout="horizontal"
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
                  width={35}
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
                  name="verbal"
                  dataKey="verbal"
                  fill="var(--bar-verbal-color)"
                  radius={[4, 4, 0, 0]}
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
                  name="math"
                  dataKey="math"
                  fill="var(--bar-math-color)"
                  radius={[4, 4, 0, 0]}
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
                      opacity={
                        hoveredBar === "math" || hoveredBar === null ? 1 : 0.2
                      }
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
            <div className="score-boxes">
              <div className="score-boxes-inner">
                <ScoreBox
                  title="Verbal"
                  score={verbalAverage.toFixed(0)}
                  improvement={verbalChange}
                  type="verbal"
                  isHighlighted={hoveredBar === "verbal"}
                />
                <ScoreBox
                  title="Math"
                  score={mathAverage.toFixed(0)}
                  improvement={mathChange}
                  type="math"
                  isHighlighted={hoveredBar === "math"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
