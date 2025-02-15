import React from "react";
import "./Navbar.css"; // Create a CSS file for styling

// Import your logos
import MaxLogo from "../../assets/max_logo.svg";
import Group36 from "../../assets/Group 36.svg";
import Group51 from "../../assets/Group 51.svg";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={MaxLogo} alt="Max Logo" className="logo" />
      </div>
      <div className="nav-items">
        <img src={Group36} alt="Group 36" className="nav-icon" />
        <img src={Group51} alt="Group 51" className="nav-icon" />
      </div>
    </nav>
  );
};

export default Navbar;
