import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Sell");
  const [phone, setPhone] = useState("");
  const [images, setImages] = useState([]); // array of base64 strings

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 4 - images.length;
    const toProcess = files.slice(0, remaining);

    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => {
          if (prev.length >= 4) return prev;
          return [...prev, event.target.result];
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("You must login first");
      return;
    }

    if (!name.trim() || !price || !category || !phone.trim()) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          category,
          description,
          type,
          phone,
          images,
          user_id: Number(user.id),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to add product");
        return;
      }

      alert("Product added successfully ✅");
      navigate("/my-listings");
      window.location.reload();
    } catch (error) {
      console.error("Add product error:", error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="add-page">
      <div className="add-card">
        <div className="add-header">
          <h2>Add Product</h2>
          <p>Create a clean listing for your item</p>
        </div>

        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-grid">
            <div className="field-group">
              <label>Product Name</label>
              <input
                type="text"
                placeholder="e.g. MacBook Air"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Price</label>
              <input
                type="number"
                placeholder="e.g. 45000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="For Study">For Study</option>
                <option value="Electronics">Electronics</option>
                <option value="Appliances">Appliances</option>
                <option value="Tools & Equipment">Tools & Equipment</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="field-group">
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Sell">Sell</option>
                <option value="Exchange">Exchange</option>
                <option value="Donation">Donation</option>
              </select>
            </div>

            <div className="field-group field-full">
              <label>Description</label>
              <textarea
                placeholder="Write a short and clear description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="field-group field-full">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="e.g. 0555555555"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="images-box">
            <div className="images-top">
              <div>
                <h3>Product Images</h3>
                <p>You can add up to 4 images from your device</p>
              </div>

              {images.length < 4 && (
                <label className="small-btn" style={{ cursor: "pointer" }}>
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

            <div className="images-list">
              {images.map((img, index) => (
                <div key={index} className="image-item">
                  <div className="image-preview">
                    <img src={img} alt={`Preview ${index + 1}`} />
                  </div>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeImage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              {images.length === 0 && (
                <p style={{ color: "#aaa", fontSize: "14px" }}>
                  No images added yet
                </p>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
