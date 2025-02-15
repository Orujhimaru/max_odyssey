import RadarChart from "../components/RadarChart";

function Dashboard() {
  return (
    <div className="dashboard">
      <RadarChart scores={[99, 100, 85, 99, 83, 93, 89]} />
    </div>
  );
}

export default Dashboard;
