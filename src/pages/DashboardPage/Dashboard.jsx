import RadarChart from "../../components/RadarChart/RadarChart";
import ScoreColumnGraph from "../../components/ScoreColumnGraph/ScoreColumn";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <RadarChart scores={[99, 75, 45, 9, 83, 23, 59]} />
      <ScoreColumnGraph />
    </div>
  );
}

export default Dashboard;
