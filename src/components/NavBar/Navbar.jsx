import React from "react";
import "./Navbar.css"; // Create a CSS file for styling
import Logo from "../Navbar/Logo";

// Import your logos
import Dashboard from "../../assets/Group 36.svg";
import Practice from "../../assets/Group 51.svg";
import Courses from "../../assets/Group 38.svg";
import Tests from "../../assets/Group 43.svg";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <Logo />
      </div>
      <div className="nav-items">
        <img src={Dashboard} alt="Group 36" className="nav-icon" />
        <img src={Courses} alt="Group 38" className="nav-icon" />
        <img src={Tests} alt="Group 43" className="nav-icon" />
        <img src={Practice} alt="Group 51" className="nav-icon" />
      </div>
    </nav>
  );
};

export default Navbar;
