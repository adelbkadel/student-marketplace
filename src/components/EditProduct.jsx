import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import "../styles/EditProduct.css";
const API_URL = import.meta.env.VITE_API_URL;

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    type: "Sell",
    phone: "",
    images: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/product/${id}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Failed to load product");
          navigate("/my-listings");
          return;
        }

        // فلترة الصور القديمة المكسورة — نبقي فقط base64
        const validImages = Array.isArray(data.images)
          ? data.images.filter((img) => img && img.startsWith("data:"))
          : [];

        setFormData({
          name: data.name || "",
          price: data.price || "",
          category: data.category || "",
          description: data.description || "",
          type: data.type || "Sell",
          phone: data.phone || "",
          images: validImages,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to load product");
        navigate("/my-listings");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 4 - formData.images.length;
    const toProcess = files.slice(0, remaining);

    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => {
          if (prev.images.length >= 4) return prev;
          return { ...prev, images: [...prev.images, event.target.result] };
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update product");
        return;
      }

      alert("Product updated successfully ✅");
      navigate("/my-listings");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  if (loading) {
    return <div className="edit-product-page">Loading...</div>;
  }

  return (
    <div className="edit-product-page">
      <div className="edit-product-card">
        <h1>Edit Product</h1>

        <form onSubmit={handleSubmit} className="edit-product-form">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="For Study">For Study</option>
            <option value="Electronics">Electronics</option>
            <option value="Appliances">Appliances</option>
            <option value="Tools & Equipment">Tools & Equipment</option>
            <option value="Others">Others</option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="Sell">Sell</option>
            <option value="Exchange">Exchange</option>
            <option value="Donate">Donate</option>
          </select>

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <div className="image-fields">
            <label>Images (max 4)</label>

            <div className="images-preview-grid">
              {formData.images.map((img, index) => (
                <div key={index} className="image-preview-item">
                  <img src={img} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {formData.images.length === 0 && (
              <p style={{ color: "#aaa", fontSize: "14px" }}>
                No images — add new ones from your device
              </p>
            )}

            {formData.images.length < 4 && (
              <label className="add-image-btn" style={{ cursor: "pointer", display: "inline-block" }}>
                + Add Image
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          <button type="submit" className="save-product-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
