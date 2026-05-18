import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Hero from "./Hero";
import "../styles/Products.css";

function Products({ products }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      product.name?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Hero />

      <div className="products-page">
        <div className="products-top">
          <h1 className="products-title">Explore Products</h1>

          <div className="products-filters">
            <input
              type="text"
              placeholder="Search products..."
              className="products-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="products-category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
            <option value="">All Categories</option>
            <option value="For Study">For Study</option>
            <option value="Electronics">Electronics</option>
            <option value="Appliances">Appliances</option>
            <option value="Tools & Equipment">Tools & Equipment</option>
            <option value="Others">Others</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="products-empty">
            <h2>No products found 😕</h2>
            <p>Try another keyword or category.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="product-image-box">
                  <img
                    src={
                      product.images?.[0] ||
                      product.image ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={product.name}
                    className="product-card-image"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                </div>

                <div className="product-card-content">
                  <div className="product-info-line product-name-line">
                    <span className="product-info-label">Product:</span>
                    <span className="product-info-value">{product.name}</span>
                  </div>

                  <div className="product-info-line">
                    <span className="product-info-label">Price:</span>
                    <span className="product-info-value">
                      {product.price} DA
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Products;