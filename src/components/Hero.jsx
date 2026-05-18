import { Link } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        

        <h1>
          Buy, Sell, Exchange.
          <br />
          Everything Students Need.
        </h1>

        <p className="hero-text">
          A modern marketplace for university students to find books,
          summaries, computers, tools, dorm supplies, and more.
        </p>

        <div className="hero-actions">
          <Link to="/products">
            <button className="hero-primary-btn">Explore Products</button>
          </Link>

          <Link to="/add-product">
            <button className="hero-secondary-btn">Add Product</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;