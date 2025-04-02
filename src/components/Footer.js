import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Placement Prep. All Rights Reserved.</p>
      <div className="footer-links">
        <a href="#">About Us</a>
        <a href="#">Contact</a>
        <a href="#">Privacy Policy</a>
      </div>
    </footer>
  );
}

export default Footer;
