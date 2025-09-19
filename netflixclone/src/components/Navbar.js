import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
        alt="Netflix Logo"
        className="logo"
      />
      <ul className="nav-links">
        <li>Home</li>
        <li>TV Shows</li>
        <li>Movies</li>
        <li>My List</li>
      </ul>
    </nav>
  );
}

export default Navbar;
