import { Link } from "react-router-dom";
import "../styles/Categories.css";

function Categories() {
  const categories = [
    "For Study 📚",
    "Electronics 💻",
    "Appliances 🏠",
    "Tools 🔧",
    "Exchange",
    "Donation",
    "Others",
  ];

  return (
    <section className="categories-section">
      <div className="categories-container">
        <h2>Popular Categories</h2>
        <p className="categories-text">
          Explore categories made for student life and academic needs.
        </p>

        <div className="categories-list">
          {categories.map((cat, index) => (
            <Link to="/categories" key={index} className="category-card">
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;