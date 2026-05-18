import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/ProductDetails.css";
const API_URL = import.meta.env.VITE_API_URL;

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/product/${id}`);
        const data = await res.json();

        if (!res.ok) {
          console.error(data.error || "Failed to fetch product");
          setProduct(null);
          return;
        }

        setProduct(data);

        const productImages =
          Array.isArray(data.images) && data.images.length > 0
            ? data.images
            : data.image
            ? [data.image]
            : [];

        setSelectedImage(productImages[0] || "");
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="details-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="details-page">
        <h2>Product not found</h2>
      </div>
    );
  }

  const productImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const whatsappNumber = product.phone?.replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in your product: ${product.name}`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="details-page">
      <div className="details-card">
        <div className="details-image-box">
          <img
            src={selectedImage || "https://via.placeholder.com/400x300?text=No+Image"}
            alt={product.name}
            className="details-image"
          />

          <div className="details-thumbnails">
            {productImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                className={`details-thumbnail ${
                  selectedImage === img ? "active-thumbnail" : ""
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="details-content">

          <h1>{product.name}</h1>
          <span className="details-type">{product.type}</span>
          <p className="details-price">{product.price} DA</p>

          <p>
            <strong>Category:</strong> {product.category}
          </p>

          <p>
            <strong>Description:</strong> {product.description}
          </p>

          <p>
            <strong>Seller:</strong> {product.seller_name || "Unknown"}
          </p>

          <p>
            <strong>Phone:</strong> {product.phone}
          </p>

          <div className="details-actions">
            <Link to={`/chat/${product.id}`} className="call-btn">
              Chat 💬
            </Link>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-btn"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
