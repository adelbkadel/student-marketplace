import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-shell">
          <button className="menu-trigger" onClick={() => setMenuOpen(true)}>
            <span className="menu-icon">☰</span>
            <span className="menu-text">Menu</span>
          </button>

          <Link to="/" className="brand-link">
            <span className="brand-mark">SM</span>
            <span className="brand-text">Student Marketplace</span>
          </Link>

          <div className="navbar-right">
            {currentUser ? (
              <span className="nav-user">
                {currentUser.first_name} {currentUser.last_name}
              </span>
            ) : (
              <NavLink to="/login" className="nav-login-top">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <div
        className={`menu-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      ></div>

      <aside className={`side-menu ${menuOpen ? "open" : ""}`}>
        <div className="side-menu-header">
          <button className="close-menu" onClick={closeMenu}>
            ✕ <span>Close</span>
          </button>
        </div>

        <div className="side-menu-links">
          <NavLink to="/products" className="side-link" onClick={closeMenu}>
            Marketplace
          </NavLink>

          <NavLink to="/add-product" className="side-link" onClick={closeMenu}>
            Add Product
          </NavLink>

          <NavLink to="/my-listings" className="side-link" onClick={closeMenu}>
            My Listings
          </NavLink>

          {currentUser?.role === "admin" && (
            <NavLink to="/admin" className="side-link" onClick={closeMenu}>
              Admin Dashboard
            </NavLink>
          )}
        <NavLink to="/conversations" className="side-link" onClick={closeMenu}>
           Conversations
          </NavLink>

          <NavLink to="/categories" className="side-link" onClick={closeMenu}>
            Categories
          </NavLink>

          <NavLink to="/about" className="side-link" onClick={closeMenu}>
            About
          </NavLink>
        </div>

        <div className="side-menu-footer">
          {currentUser ? (
            <>
              <div className="side-user-box">
                <p className="side-user-label">Signed in as</p>
                <p className="side-user-name">
                  {currentUser.first_name} {currentUser.last_name}
                </p>
              </div>

              <button className="side-auth-btn logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <div className="side-auth-actions">
              <NavLink to="/login" className="side-auth-btn" onClick={closeMenu}>
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="side-auth-btn register-btn"
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Navbar;