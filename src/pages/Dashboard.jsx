import RadarChart from "../components/RadarChart";

function Dashboard() {
  return (
    <div className="dashboard">
      <RadarChart scores={[73, 41, 33, 55, 27, 63, 71]} />
    </div>
  );
}

export default Dashboard;
