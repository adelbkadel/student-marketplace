import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-logo">Student Marketplace</h2>
        <p className="footer-text">
          A simple marketplace for university students.
        </p>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/products">Marketplace</Link>
          <Link to="/add-product">Add Product</Link>
          <Link to="/my-listings">My Listings</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/about">About</Link>
        </div>

        <p className="footer-copy">
          © 2026 Student Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;