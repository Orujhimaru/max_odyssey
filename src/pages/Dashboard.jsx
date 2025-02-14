import RadarChart from "../components/RadarChart";

function Dashboard() {
  return (
    <div className="dashboard">
      <RadarChart scores={[3, 4, 7, 6, 3, 4, 5]} />
    </div>
  );
}

export default Dashboard;
