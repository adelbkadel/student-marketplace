import { Link } from "react-router-dom";
import "../styles/LatestProducts.css";

function LatestProducts() {
  const demoProducts = [
    {
      name: "Laptop HP",
      category: "Computers",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    },
    {
      name: "Math Book",
      category: "Books",
      image:
        "https://images.unsplash.com/photo-1544717305-2782549b5136",
    },
    {
      name: "Scientific Calculator",
      category: "Tools",
      image:
        "https://images.unsplash.com/photo-1580910051074-3eb694886505",
    },
  ];

  return (
    <section className="latest">
      <div className="latest-container">
        <h2>Latest Products</h2>
        <p className="latest-text">
          Discover some of the newest items available on the marketplace.
        </p>

        <div className="latest-grid">
          {demoProducts.map((item, i) => (
            <div key={i} className="latest-card">
              <img src={item.image} alt={item.name} className="latest-image" />
              <div className="latest-info">
                <h3>{item.name}</h3>
                <p>{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="latest-action">
          <Link to="/products">
            <button>View Marketplace</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LatestProducts;