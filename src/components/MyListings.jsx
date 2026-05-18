import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "../styles/MyListings.css";
const API_URL = import.meta.env.VITE_API_URL;

function MyListings({ deleteProduct }) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchMyProducts = async () => {
      try {
        const res = await fetch(
          `${API_URL}/my-products/${currentUser.id}`
        );
        const data = await res.json();

        const safeData = Array.isArray(data) ? data : [];

        const formattedProducts = safeData.map((product) => ({
          ...product,
          images: Array.isArray(product.images) ? product.images : [],
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching my products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="products-page">
        <h1 className="products-title">My Listings</h1>
        <div className="products-empty">Loading...</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-top">
        <h1 className="products-title">My Listings</h1>
      </div>

      {products.length === 0 ? (
        <div className="products-empty">
          <h2>No listings yet</h2>
          <p>You have not added any product yet.</p>
          <Link to="/add-product" className="nav-register">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-box">
                <img
                  src={
                    product.images?.[0] ||
                    product.image ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={product.name}
                  className="product-card-image"
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

                <div className="product-info-line">
                  <span className="product-info-label">Category:</span>
                  <span className="product-info-value">{product.category}</span>
                </div>

                <div className="product-info-line">
                <span className="product-info-label">Type:</span>
                <span className="product-info-value">{product.type}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <Link to={`/edit/${product.id}`} className="edit-btn-link">
                    Edit
                  </Link>

                  <button
                    className="side-auth-btn logout-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;
