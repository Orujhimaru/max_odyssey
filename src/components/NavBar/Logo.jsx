import Max from "../../assets/max_logo.svg";

const Logo = () => {
  return (
    <div
      style={{
        backgroundColor: "#3D3D3D",
        borderRadius: "4px", // or your preferred size
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px",
      }}
    >
      <img
        src={Max}
        alt="Logo"
        style={{
          width: "52px",
        }}
      />
    </div>
  );
};

export default Logo;
